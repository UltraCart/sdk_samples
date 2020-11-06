<?php
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
?>
<!DOCTYPE html>
<html>
<body>
<?php

error_reporting(E_ALL);
require_once(__DIR__ . '/SwaggerClient-php/autoload.php');
$simple_key = '4256aaf6dfedfa01582fe9a961ab0100216d737b874a4801582fe9a961ab0100';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);
ultracart\v2\Configuration::getDefaultConfiguration()->addDefaultHeader("X-UltraCart-Api-Version", "2017-03-01");

$order_api = new ultracart\v2\api\OrderApi();

$order_expansion = "shipping,billing,item,summary,payment,coupon,taxes"; // see www.ultracart.com/api/ for all the expansion fields available
$order_api = new \ultracart\v2\api\OrderApi();

$order_query = new \ultracart\v2\models\OrderQuery();
$order_query->setEmail('test@test.com');
$orders_response = $order_api->getOrdersByQuery($order_query, 200, 0, null,$order_expansion);


if ($orders_response->getError() != null) {
    $orders_response->getError()->getDeveloperMessage();
    $orders_response->getError()->getUserMessage();
}
$orders = $orders_response->getOrders();

// -----------------------------------------------------------------------
// single order
// -----------------------------------------------------------------------
 $order_id = "DEMO-0009103586";
 $order_response = $order_api->getOrder($order_id, $order_expansion);
if ($order_response->getSuccess()) {
    $order = $order_response->getOrder();
}

// update the order here.
// request the same order expansion, or the updated object will not contain the same fields as the original 'get' request
//$order_response = $order_api->updateOrder($order, $order_id, $order_expansion);
//if ($order_response->getError() != null) {
//    $order_response->getError()->getDeveloperMessage();
//    $order_response->getError()->getUserMessage();
//}


// here is how to access the shipping fields
foreach ($orders as $order) {

    $s_addr = $order->getShipping();
    $s_addr->getAddress1();
    $s_addr->getAddress2();
    $s_addr->getCity();
    $s_addr->getStateRegion();
    $s_addr->getCountryCode();
    $s_addr->getPostalCode();


    $b_addr = $order->getBilling();
    $b_addr->getAddress1();
    $b_addr->getAddress2();
    $b_addr->getCity();
    $b_addr->getStateRegion();
    $b_addr->getCountryCode();
    $b_addr->getPostalCode();
    $b_addr->getEmail(); // email is located on the billing object.

// here is how to access the items
    $items = $order->getItems();
    foreach ($items as $item) {
        $qty = $item->getQuantity();
        $itemId = $item->getMerchantItemId();
        $description = $item->getDescription();
        $cost = $item->getCost();
        $cost->getLocalized(); // cost as float.
        $cost->getLocalizedFormatted(); // cost with symbols.
    }
}

?>
<pre>
    <h1>Order</h1>
    <?php echo print_r($orders); ?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

