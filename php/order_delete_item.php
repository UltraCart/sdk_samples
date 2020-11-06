<?php /* docs.ultracart.com sample */ ?>
<?php // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/55574544/PHP+SDK+Sample+Delete+item+from+order ?>
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

function die_if_api_error(\ultracart\v2\models\OrderResponse $order_response){
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


    $order_id = 'DEMO-0009103099';
    $new_item_id = 'PDF';

    $order_expansion = "item"; // this is absolutely critical.  expansion must contain item or you'll wipe out the existing items.
    $order_api = new \ultracart\v2\api\OrderApi();
    $order_response = $order_api->getOrder($order_id, $order_expansion);
    die_if_api_error($order_response);

    // ---------------------------------------------------------------
    // add the item to ensure it exists on the order before deleting.

    $order = $order_response->getOrder();
    $items = $order->getItems();

    // what is the distribution center code of an item on this order.  to keep things simple, let's just use the
    // sample distribution center code.
    $dc_code = $items[0]->getDistributionCenterCode();

    // all of the below properties are required.
    $new_item = new \ultracart\v2\models\OrderItem();
    $new_item->setQuantity(2);
    $new_item->setMerchantItemId($new_item_id);
    $new_item->setDescription("PDF blueprint or something...");
    $new_item->setCost(new \ultracart\v2\models\Currency(['value' => 9.99]));
    $new_item->setWeight(new \ultracart\v2\models\Weight(['uom' => "OZ", 'value' => 5]));
    $new_item->setDistributionCenterCode($dc_code);


    array_push($items, $new_item);
    $order->setItems($items);
    $order_response = $order_api->updateOrder($order, $order_id, $order_expansion);
    die_if_api_error($order_response);
    // ---------------------------------------------------------------


    $order = $order_response->getOrder();
    $items = $order->getItems();

    foreach($items as $key => $item){
        echo "examining $key<br>";
        if($item->getMerchantItemId() === $new_item_id){
            echo "removing $key<br>";
            unset($items[$key]);
        }
    }
    // $order->setItems(array_values(array_filter($items)));

    $order_response = $order_api->updateOrder($order, $order_id, $order_expansion); // be sure to use the same expansion so the result can be checked.
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

