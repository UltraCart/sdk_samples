<?php

require_once __DIR__ . '/vendor/autoload.php';

// Configure API key authorization: ultraCartSimpleApiKey
// They key below is a development key so 1) not worried you're seeing it and 2) it won't work for you.
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', '0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100');

// Disable SSL verification if we're having issues with this PHP install not having the proper CA installed.
//  Fix your CA for a production environment!
// Set debug to true if you need more information on request/response
$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);

$api_instance = new ultracart\v2\api\OrderApi(
    $client,
    ultracart\v2\Configuration::getDefaultConfiguration(),
    new ultracart\v2\HeaderSelector("2017-03-01")
);

// The UltraCart objects are large.  Very large.  So we have encapsulated the fields in sub objects allowing you to
// only request the sub objects you need.  This is done via the expansion object.   The API docs on the main web site
// have more details about expansions:  https://www.ultracart.com/api/#expansion.html
$_expand = "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes"; // string | The object expansion to perform on the result.

// this is a detailed example that includes chunking to illustrate how to fetch large record sets from UltraCart.
$_limit = 100;
$counter = 1;
$order_query = new \ultracart\v2\models\OrderQuery();
// we are essentially setting the dates to 'forever' to get all records.
$order_query->setPaymentDateBegin("2010-01-01T00:00:00.0000000-05:00");
$order_query->setPaymentDateEnd("2021-01-01T00:00:00.0000000-05:00");
// there are multiple stages for order flow.  when doing analysis, you almost always want *only* completed orders.
$order_query->setCurrentStage(\ultracart\v2\models\OrderQuery::CURRENT_STAGE_COMPLETED_ORDER);

$order_response = null;

echo "<html><body><pre>";
try {
    do {
        if ($order_response == null) {
            $order_response = $api_instance->getOrdersByQuery($order_query, $_limit, 0, null, $_expand);
        } else {
            $order_response = $api_instance->getOrdersByQuery($order_query, $_limit, $order_response->getMetadata()->getResultSet()->getNextOffset(), null, $_expand);
        }

        echo "order_response.Orders.length: " . sizeof($order_response->getOrders()) . "\n";
        // print out a line for each order *item*
        // notice, email is within the billing child object.
        foreach ($order_response->getOrders() as $order) {
            $order_id = $order->getOrderId();
            $email = $order->getBilling()->getEmail(); // notice the email is part of the billing sub object.
            foreach($order->getItems() as $item){
                echo $order_id . ',' . $email . ',' . $item->getMerchantItemId() . ',' . $item->getQuantity() . "\n";
            }
        }
    } while ($order_response->getMetadata()->getResultSet()->getMore());

} catch (Exception $e) {
    echo 'Exception when calling OrderApi->getOrdersByQuery: ', $e->getMessage(), PHP_EOL;
}
echo "</pre></body></html>";
?>