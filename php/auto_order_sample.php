<?php /* docs.ultracart.com sample */ ?>

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

$auto_order_api = new ultracart\v2\api\AutoorderApi($client, $config, $headerSelector);
?>

<!DOCTYPE html>
<html>
<body>
<?php

try {
    $auto_order_oid = 2078718;  // this is found either by looping through auto orders, or from the back end.
    $auto_order_response = $auto_order_api->getAutoOrder($auto_order_oid, "items");
    $auto_order = $auto_order_response->getAutoOrder();
    $auto_order->getItems()[0]->setArbitraryQuantity(4);
    $auto_order_response = $auto_order_api->updateAutoOrder($auto_order, $auto_order_oid);

} catch (\ultracart\v2\ApiException $e) {
    error_log($e->getResponseBody());
}

?>
<pre>
<?php echo print_r($auto_order); ?>
<?php echo print_r($auto_order_response); ?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

