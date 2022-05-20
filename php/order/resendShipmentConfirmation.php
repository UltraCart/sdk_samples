<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
 * OrderApi.resendShipmentConfirmation() will resend (email) a shipment confirmation to a customer.
 *
 */

use ultracart\v2\api\OrderApi;

$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104436';

$api_response = $order_api->resendShipmentConfirmation($order_id);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    echo 'Order could not be adjusted.  See php error log.';
    exit();
}

echo '<html lang="en"><body><pre>';
if($api_response->getSuccess()){
    echo 'Shipment confirmation was resent.';
} else {
    echo 'Failed to resend shipment confirmation.';
}
echo '</pre></body></html>';