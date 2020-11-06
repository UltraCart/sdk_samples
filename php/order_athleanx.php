<!DOCTYPE html>
<html>
<body>
<?php
// for testing and development only
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>

<?php
// initialization code
require_once './vendor/autoload.php';
$simple_key = '30c60405485c790162078f595a051400ee010ca178dfaf0162078f595a051400';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
?>

<?php

function die_if_api_error(\ultracart\v2\models\OrderResponse $order_response)
{
    if ($order_response->getError() != null) {
        echo "Error:<br>";
        echo $order_response->getError()->getDeveloperMessage() . '<br>';
        echo $order_response->getError()->getUserMessage() . '<br>';
        die('handle this error gracefully');
    }
}

function die_if_api_error2(\ultracart\v2\models\OrdersResponse $orders_response)
{
    if ($orders_response->getError() != null) {
        echo "Error:<br>";
        echo $orders_response->getError()->getDeveloperMessage() . '<br>';
        echo $orders_response->getError()->getUserMessage() . '<br>';
        die('handle this error gracefully');
    }
}

?>
<?php


try {

    // see www.ultracart.com/api/ for all the expansion fields available
    $order_expansion = "shipping,billing,item,summary,payment,coupon,taxes";
    $order_query = new \ultracart\v2\models\OrderQuery();
    $order_query->setEmail('rchrodger@gmail.com');

    $orders_response = $order_api->getOrdersByQuery($order_query, 200, 0, null, $order_expansion);
    die_if_api_error2($orders_response);

    $orders = $orders_response->getOrders();

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

} catch (\ultracart\v2\ApiException $e) {
    echo 'API Exception when calling OrderAPI: ', $e->getMessage(), PHP_EOL;
    echo print_r($e->getResponseBody()), PHP_EOL;
} catch (Exception $e) {
    echo 'Exception when calling OrderAPI: ', $e->getMessage(), PHP_EOL;
}

?>
</body>
</html>