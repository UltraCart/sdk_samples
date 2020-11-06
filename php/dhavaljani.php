<?php /* docs.ultracart.com sample */ ?>
<?php
// Did you get an error?
// See this:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
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
$simple_key = '9a107dd639f204016363537cfe0516007ab76668b17145016363537cff051600';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for
version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
?>

<?php

function die_if_api_error(\ultracart\v2\models\OrderResponse
                          $order_response){
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


    $order_id = 'RKSOL-201805210310-533405';
    $new_item_id = 'Cap-10mg-3B';

    $order_expansion = "item"; // this is absolutely critical. expansion must contain item or you'll wipe out the existing items.
$order_api = new \ultracart\v2\api\OrderApi();
$order_response = $order_api->getOrder($order_id, $order_expansion);
die_if_api_error($order_response);

$order = $order_response->getOrder();
$items = $order->getItems();

$new_item = new \ultracart\v2\models\OrderItem();
$new_item->setQuantity(2);
$new_item->setMerchantItemId($new_item_id);
$new_item->setDescription("PDF blueprint or something...");
$new_item->setCost(new \ultracart\v2\models\Currency(['value' =>
9.99]));
$new_item->setWeight(new \ultracart\v2\models\Weight(['uom' => "OZ",
'value' => 5]));
$new_item->setDistributionCenterCode('DFLT'); // don't assume the code. look it up on the item.

    array_push($items, $new_item);

$order_response = $order_api->updateOrder($order, $order_id,
    $order_expansion); // be sure to use the same expansion so the result can be checked.
    die_if_api_error($order_response);

$updated_order = $order_response->getOrder();
foreach ($updated_order->getItems() as $item) {
    echo "<pre>";
    echo print_r($item);
    echo "</pre>";
    echo "-----------------------------------------";
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
