<?php

ini_set('display_errors', 1);

/*
 * OrderApi.cancelOrderWithOptions() cancels an order, the same as cancelOrder(), with the options in a request body.
 * An empty OrderCancelRequest behaves exactly like cancelOrder().
 *
 * Options:
 * - reject_reason:          stored on the order when it is rejected without a refund (Accounts Receivable, Pre-order,
 *                           Quote or Hold), the same as the reject reason in the backend.  Reasons are configured at
 *                           Home -> Configuration -> Order Management -> Refund/Reject Reasons
 * - lock_self_ship_orders:  prevent the order from shipping during the refund process
 * - skip_refund_and_hold:   skip the refund and move the order to the Held Orders department
 *
 * Rejecting an order in Accounts Receivable:
 * - The customer is not emailed.
 * - A rejected auto order rebill leaves the auto order active, so it rebills on its next cycle.
 * - Rejecting the auto order's original order cancels the auto order, because the first payment never succeeded.
 *
 * Restrictions (the same as cancelOrder()):
 * 1) Cannot cancel completed orders
 * 2) Cannot cancel already rejected orders
 * 3) Cannot cancel orders transmitted to fulfillment center
 * 4) Cannot cancel orders queued for distribution center transmission
 *
 * Requires SDK 4.1.260 or later.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\OrderCancelRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104436';

echo '<html lang="en"><body><pre>';

try {
    $cancel_request = new OrderCancelRequest();
    $cancel_request->setRejectReason('Card declined');

    $api_response = $order_api->cancelOrderWithOptions($order_id, $cancel_request);

    if ($api_response->getError() != null) {
        error_log($api_response->getError()->getDeveloperMessage());
        error_log($api_response->getError()->getUserMessage());
        echo "Order could not be canceled.  See error log.\n";
        exit();
    }

    if ($api_response->getSuccess()) {
        echo "Order was canceled successfully.\n";
    }

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e->getResponseBody()); // <-- change_me: handle gracefully
    die(1);
}

echo '</pre></body></html>';
