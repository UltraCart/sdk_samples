<?php /* docs.ultracart.com sample */ ?>
<?php // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/55574541/PHP+SDK+Sample+Add+item+to+order ?>
<?php
// Did you get an error?
// See this: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
?>

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
$simple_key = '4256aaf6dfedfa01582fe9a961ab0100216d737b874a4801582fe9a961ab0100';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
?>

<?php

function die_if_api_error(\ultracart\v2\models\OrdersResponse $order_response){
    if ($order_response->getError() != null) {
        echo "Error:<br>";
        echo $order_response->getError()->getDeveloperMessage() . '<br>';
        echo $order_response->getError()->getUserMessage() . '<br>';
        die('handle this error gracefully');
    }
}

?>

<!DOCTYPE html>
<html>
<body>
<?php


try {

    $email = "test@test.com";
    $order_query = new \ultracart\v2\models\OrderQuery();
    $order_query->setEmail($email);
    $orders_response = $order_api->getOrdersByQuery($order_query);
    die_if_api_error($orders_response);


    foreach($orders_response->getOrders() as $order){
        $order_api->resendReceipt($order->getOrderId());
        echo "Resent receipt for Order ID " . $order->getOrderId();
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

