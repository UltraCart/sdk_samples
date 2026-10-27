<?php

ini_set('display_errors', 1);

/*
 * Scenario: an order is paid and sitting in the Shipping Department.  The warehouse has not printed a label yet,
 * and the customer asks to cancel the order and get a full refund.
 *
 * The UltraCart part is a single call: refundOrder() with reject_after_refund=true.  This is the API version of the
 * "Complete Refund (then reject)" button in the backend.  It refunds the order to the original payment method and
 * moves the order out of the Shipping Department into Rejected.  No separate cancel call is needed.
 *
 * Sequence:
 * 1) getOrder()          - confirm the order is in the Shipping Department and has no tracking numbers.
 * 2) isRefundableOrder() - confirm UltraCart will allow the refund.
 * 3) Cancel the order at your fulfillment provider.
 *    - Using ShipStation with "Cancel in ShipStation on Full Refund" set to Yes on the distribution center's
 *      transport mechanism?  Skip this step.  After the full refund in step 4, UltraCart automatically tells
 *      ShipStation to cancel the order.  Test this end to end on a test order before relying on it.  If ShipStation
 *      refuses (a label already exists), the refund has already happened.  UltraCart records the refusal as a
 *      warning in the distribution center log.
 *    - Otherwise, cancel the order at your fulfillment provider FIRST.  If it refuses because a label already
 *      exists, stop and do not refund.  This sample does not make that call.
 * 4) refundOrder()       - full refund, then reject.
 *
 * Questions this sample answers:
 * - Will UltraCart re-send the order to the fulfillment center afterwards?  No.  An order is only retransmitted if
 *   someone moves it back into the Shipping Department with retransmit checked, or clicks Retransmit.
 * - Why not cancelOrder()?  cancelOrder() fails once an order is queued for or transmitted to a fulfillment center,
 *   which is the case for an order waiting in the Shipping Department.
 * - What about orders created by an auto order?  Pass auto_order_cancel=false and the auto order is left alone.
 *   Cancel the auto order separately if that is what the customer wants.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104436';

// See: https://www.ultracart.com/api/ for a list of all expansions.
$expansion = 'item,shipping,summary,auto_order';

echo '<html lang="en"><body><pre>';

try {
    // Step 1. Retrieve the order and make sure it has not shipped.
    $order_response = $order_api->getOrder($order_id, $expansion);
    if ($order_response->getError() != null) {
        error_log($order_response->getError()->getDeveloperMessage());
        error_log($order_response->getError()->getUserMessage());
        exit();
    }
    $order = $order_response->getOrder();

    if ($order->getCurrentStage() != 'Shipping Department') {
        echo "Order is in stage '" . $order->getCurrentStage() . "', not the Shipping Department.  Not refunding.\n";
        exit();
    }
    $tracking_numbers = $order->getShipping() != null ? $order->getShipping()->getTrackingNumbers() : null;
    if (!empty($tracking_numbers)) {
        echo 'Order already has tracking numbers ' . implode(', ', $tracking_numbers) . ".  Too late to cancel.\n";
        exit();
    }
    if ($order->getAutoOrder() != null) {
        echo 'Order belongs to auto order ' . $order->getAutoOrder()->getAutoOrderCode() . ".  The auto order will not be cancelled.\n";
    }

    // Step 2. Ask UltraCart whether the order can be refunded.
    $refundable_response = $order_api->isRefundableOrder($order_id);
    if ($refundable_response->getRefundable() !== true) { // null should be treated as false
        echo "Order is not refundable:\n";
        var_dump($refundable_response);
        exit();
    }

    // Step 3. Unless ShipStation cancels the order for you (see the comment above), cancel it at your fulfillment provider here, before refunding.

    // Step 4. Mark everything as refunded.  These are TOTAL amounts (positive numbers), not deltas.
    // Warning: if this is a 2nd refund after an earlier partial refund, account for what was already refunded.
    // A refund reason may be required by your account.  It is configured at
    // Home -> Configuration -> Order Management -> Refund/Reject Reasons
    // $order->setRefundReason('CustomerCancel');
    $order->getSummary()->setTaxRefunded($order->getSummary()->getTax());
    $order->getSummary()->setShippingHandlingRefunded($order->getSummary()->getShippingHandlingTotal());
    foreach ($order->getItems() as $item) {
        $item->setQuantityRefunded($item->getQuantity());
        $item->setTotalRefunded($item->getTotalCostWithDiscount());
    }

    $reject_after_refund = true;             // moves the order out of the Shipping Department into Rejected
    $skip_customer_notification = false;     // let the customer know their refund is on the way
    $auto_order_cancel = false;              // leave the auto order (if any) alone
    $manual_refund = false;                  // refund through the payment gateway, to the original payment method
    $reverse_affiliate_transactions = true;  // no affiliate commission on a cancelled order
    $issue_store_credit = false;             // money back, not store credit
    $auto_order_cancel_reason = null;

    $refund_response = $order_api->refundOrder($order_id, $order, $reject_after_refund, $skip_customer_notification,
        $auto_order_cancel, $manual_refund, $reverse_affiliate_transactions, $issue_store_credit,
        $auto_order_cancel_reason, 'item,summary');

    // "Request to refund an invalid amount." means the refund total came out as zero or less.
    if ($refund_response->getError() != null) {
        error_log($refund_response->getError()->getDeveloperMessage());
        error_log($refund_response->getError()->getUserMessage());
        exit();
    }

    $refunded_order = $refund_response->getOrder();
    echo 'Current Stage: ' . $refunded_order->getCurrentStage() . "\n"; // should be Rejected
    echo 'Total Refunded: ' . $refunded_order->getSummary()->getTotalRefunded()->getValue() . "\n";

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}

echo '</pre></body></html>';
