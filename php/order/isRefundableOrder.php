<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    isRefundable queries the UltraCart system whether an order is refundable or not.
    In addition to a simple boolean response, UltraCart also returns back any reasons why
    an order is not refundable.
    Finally, the response also contains any refund or return reasons configured on the account in the event
    that this merchant account is configured to require a reason for a return or refund.

 */


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009104976';
$api_response = $order_api->isRefundableOrder($order_id);

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';
