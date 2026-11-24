<?php

ini_set('display_errors', 1);

/*
 * Scenario: you run your own Accounts Receivable retry process instead of UltraCart's Accounts Receivable Retry service.
 * A customer's card was declined (for example on an auto order rebill) and the order is sitting in Accounts Receivable.
 * Your process decides, order by order, whether to retry the charge, ask the customer to update their billing
 * information, or give up and reject the order.
 *
 * Sequence:
 * 1) getOrder()                 - confirm the order is still in Accounts Receivable.
 * 2) processPayment()           - retry the charge.  Optionally pick the gateway with rotating_transaction_gateway_code.
 * 3) If the retry is declined, either:
 *    a) sendUpdateBillingEmail()   - email the customer a link to update their card, or
 *    b) cancelOrderWithOptions()   - give up and reject the order, with a reject reason.
 *
 * Questions this sample answers:
 * - Is an API retry of an auto order rebill sent to the gateway as a recurring transaction?  Yes.  processPayment()
 *   flags the charge as recurring whenever the order belongs to an auto order, the same as UltraCart's retry service.
 * - Can I choose the gateway?  Yes, with rotating_transaction_gateway_code on the process payment request.  It must be
 *   an active rotating transaction gateway on the account.  The charge is attempted on that gateway only, with no
 *   cascade to your other gateways, the same as choosing a gateway on the Accounts Receivable Process Payment screen.
 *   If the gateway does not support the card type, UltraCart's normal gateway selection is used; the transaction
 *   details show which gateway processed the charge.
 * - Does rejecting the order cancel the customer's auto order?  Not for a rebill.  A rejected rebill leaves the auto
 *   order active, so it rebills on its next cycle.  Rejecting the auto order's original order cancels the auto order.
 * - Does the customer get an email when the order is rejected?  No.
 * - How often can I send the update billing email?  Once per order per 24 hours through the API.  While the order is
 *   less than 7 days old, UltraCart also sends a reminder every 2 days on its own.
 *
 * Requires SDK 4.1.260 or later.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\OrderCancelRequest;
use ultracart\v2\models\OrderProcessPaymentRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104436';

// Optional.  The code of an active rotating transaction gateway on your account, or null to let UltraCart choose.
$rotating_transaction_gateway_code = null; // change_me: e.g. 'BACKUP_GATEWAY'

// What to do if the retry is declined.  true rejects the order, false asks the customer to update their card.
$give_up_if_declined = false;
$reject_reason = 'Card declined'; // Configured at Home -> Configuration -> Order Management -> Refund/Reject Reasons

echo '<html lang="en"><body><pre>';

try {
    // Step 1. Make sure the order is still in Accounts Receivable.
    $order_response = $order_api->getOrder($order_id, 'auto_order');
    if ($order_response->getError() != null) {
        error_log($order_response->getError()->getDeveloperMessage());
        error_log($order_response->getError()->getUserMessage());
        exit();
    }
    $order = $order_response->getOrder();

    if ($order->getCurrentStage() != 'Accounts Receivable') {
        echo "Order is in stage '" . $order->getCurrentStage() . "', not Accounts Receivable.  Nothing to do.\n";
        exit();
    }
    if ($order->getAutoOrder() != null) {
        echo 'Order belongs to auto order ' . $order->getAutoOrder()->getAutoOrderCode() . ".  The retry is sent as a recurring charge.\n";
    }

    // Step 2. Retry the charge.
    $process_payment_request = new OrderProcessPaymentRequest();
    if ($rotating_transaction_gateway_code != null) {
        $process_payment_request->setRotatingTransactionGatewayCode($rotating_transaction_gateway_code);
    }

    $payment_response = $order_api->processPayment($order_id, $process_payment_request);
    $transaction = $payment_response->getPaymentTransaction();

    if ($transaction == null) {
        // No charge was attempted.  For example, the gateway code is not an active gateway on the account.
        $reason = $payment_response->getError() != null ? $payment_response->getError()->getUserMessage() : 'unknown reason';
        echo "Payment was not attempted: $reason\n";
        exit();
    }

    $gateway_used = null;
    foreach ($transaction->getDetails() ?? [] as $detail) {
        if ($detail->getName() == 'rotatingTransactionGatewayCode') {
            $gateway_used = $detail->getValue();
        }
    }
    echo 'Charge attempted through ' . $transaction->getTransactionGateway() . " (rotating gateway $gateway_used)\n";

    if ($payment_response->getSuccess()) {
        echo "Payment succeeded.  The order has moved out of Accounts Receivable.\n";
        exit();
    }

    echo "Payment was declined.\n";

    // Step 3. The retry was declined.
    if ($give_up_if_declined) {
        // Step 3b. Reject the order.  The customer is not emailed, and an auto order rebill keeps its auto order.
        $cancel_request = new OrderCancelRequest();
        $cancel_request->setRejectReason($reject_reason);
        $cancel_response = $order_api->cancelOrderWithOptions($order_id, $cancel_request);
        if ($cancel_response->getSuccess()) {
            echo "Order was rejected.\n";
        } else {
            $reason = $cancel_response->getError() != null ? $cancel_response->getError()->getUserMessage() : 'unknown reason';
            echo "Order could not be rejected: $reason\n";
        }
    } else {
        // Step 3a. Ask the customer to update their billing information.  Throws an ApiException (HTTP 400) with
        // the reason if UltraCart will not send it, for example if it was already sent through the API in the last 24 hours.
        $email_response = $order_api->sendUpdateBillingEmail($order_id);
        if ($email_response->getSuccess()) {
            echo "Update billing email was queued.\n";
        }
    }

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e->getResponseBody()); // <-- change_me: handle gracefully
    die(1);
}

echo '</pre></body></html>';
