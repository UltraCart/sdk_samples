<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    getOrderEdiDocuments returns back all EDI documents associated with an order.

    Possible Errors:
    Order.channelPartnerOid is null -> "Order is not associated with an EDI channel partner."

 */


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009104976';
$documents = $order_api->getOrderEdiDocuments($order_id)->getEdiDocuments();

echo '<html lang="en"><body><pre>';
var_dump($documents);
echo '</pre></body></html>';
