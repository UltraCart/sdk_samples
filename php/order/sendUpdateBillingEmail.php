<?php

ini_set('display_errors', 1);

/*
 * OrderApi.sendUpdateBillingEmail() emails the customer a link to update their billing information on an order
 * that is in Accounts Receivable.  It is the API version of the "Send Billing Update" button on the
 * Accounts Receivable Process Payment screen.  The email goes out within a minute.
 *
 * While the order is less than 7 days old, UltraCart sends a reminder every 2 days after this email.
 *
 * The call is refused (HTTP 400, thrown as an ApiException) when:
 * - the order is not in Accounts Receivable
 * - the order does not have a valid email address
 * - the update billing email is turned off for the account
 * - a StoreFront communication flow handles unprocessed payments for the order (the flow emails the customer instead)
 * - this method already sent the email for the order in the last 24 hours
 *
 * Requires SDK 4.1.260 or later.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104436';

echo '<html lang="en"><body><pre>';

try {
    $api_response = $order_api->sendUpdateBillingEmail($order_id);

    if ($api_response->getError() != null) {
        error_log($api_response->getError()->getDeveloperMessage());
        error_log($api_response->getError()->getUserMessage());
        exit();
    }

    if ($api_response->getSuccess()) {
        echo "Update billing email was queued.\n";
    }

} catch (ApiException $e) {
    // The reason for a refusal is in the response body.
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e->getResponseBody()); // <-- change_me: handle gracefully
    die(1);
}

echo '</pre></body></html>';
