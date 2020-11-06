<?php

require_once(__DIR__ . '/SwaggerClient-php/autoload.php');

$simple_key = '4256aaf6dfedfa01582fe9a961ab0100216d737b874a4801582fe9a961ab0100';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);
//ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', '5944a01cc620fd015bd70587980514008e68a1df179f6d015bd7058798051400');
ultracart\v2\Configuration::getDefaultConfiguration()->addDefaultHeader("X-UltraCart-Api-Version", "2017-03-01");

$order_api = new ultracart\v2\api\OrderApi();
$order_id = "DEMO-0009103586"; // string | The order id to retrieve.
// include any parts of the order you desire to receive
$expansion = "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes";

try {
    $result = $order_api->orderOrdersOrderIdGet($order_id, $expansion);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling OrderApi->orderOrdersOrderIdGet: ', $e->getMessage(), PHP_EOL;
}
?>