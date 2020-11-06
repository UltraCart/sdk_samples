<html>
<body>
<pre>

<?php /* docs.ultracart.com sample */ ?>
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

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
$put_response = null;
try{
    $order_id = "DEMO-0009103586";
    $order_expansion = "item";
    $order_response = $order_api->getOrder($order_id, $order_expansion);
    if ($order_response->getSuccess()) {

        $order = $order_response->getOrder();
//        echo print_r($order);
        $items = $order->getItems();
//        echo print_r($items);

        $item1 = new \ultracart\v2\models\OrderItem();
        $item1->setMerchantItemId('PDF');
        $item1->setQuantity(1);
        $item1->setDescription("urDad");
        $item1->setCost(new \ultracart\v2\models\Currency(['value' => 1.99]));
        $item1->setWeight(new \ultracart\v2\models\Weight(['uom' => 'OZ', 'value' => 5]));
        $item1->setDistributionCenterCode('DFLT');

        array_push($items, $item1);

        $item2 = new \ultracart\v2\models\OrderItem();
        $item2->setMerchantItemId('CJ-1633912-10-530');
        $item2->setQuantity(1);
        $item2->setDescription("urMom");
        $item2->setCost(new \ultracart\v2\models\Currency(['value' => 1.99]));
        $item2->setWeight(new \ultracart\v2\models\Weight(['uom' => 'OZ', 'value' => 5]));
        $item2->setDistributionCenterCode('DFLT');

        array_push($items, $item2);

        $item3 = new \ultracart\v2\models\OrderItem();
        $item3->setMerchantItemId('CJ-1633912-10-531');
        $item3->setQuantity(1);
        $item3->setDescription("urBrother");
        $item3->setCost(new \ultracart\v2\models\Currency(['value' => 1.99]));
        $item3->setWeight(new \ultracart\v2\models\Weight(['uom' => 'OZ', 'value' => 5]));
        $item3->setDistributionCenterCode('DFLT');

        array_push($items, $item3);
        $order->setItems($items);

        $put_response = $order_api->updateOrder($order, $order_id, $order_expansion);

        $order = $put_response->getOrder();
        echo print_r($order);

    }

} catch (\ultracart\v2\ApiException $e) {
    echo 'Exception when calling OrderApi: ', $e->getMessage(), PHP_EOL;
    print_r($e->getResponseObject());
}


?>

<?php //echo print_r($order_id); ?>
<?php //echo print_r($order_response); ?>
<?php //echo print_r($order); ?>

</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

