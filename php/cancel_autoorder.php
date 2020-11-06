<?php
require_once './vendor/autoload.php';

$simple_key = 'SIMPLEKEY';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

//$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
$auto_order_api = new ultracart\v2\api\AutoOrderApi($client, $config, $headerSelector);

try {
    $_limit = 10;
    $_offset = 0;
    $_sort = "-creation_dts"; // string | The sort order of the auto orders.  See Sorting documentation for examples of using multiple values and sorting by ascending and descending.
    $_expand = "items"; // string | The object expansion to perform on the result.

    $auto_order_query = new \ultracart\v2\models\AutoOrderQuery();
    $auto_order_query->setEmail('ivan.drkareem@gmail.com');
    $auto_order_query->setStatus('active');

    $result = $auto_order_api->getAutoOrdersByQuery($auto_order_query, $_limit, $_offset, $_sort, $_expand);

    $test = $result->getAutoOrders()[0]; // auto_order_oid = 4001138
    $test->setEnabled(false);
    $test->setCanceledDts(date("c")); // ISO - 2019-07-25T17:09:00-04:00
    //$test->setCanceledByUser("customer");
    $test->setItems(NULL); // Don't update items

    $cancel = $auto_order_api->updateAutoOrder($test, $test->getAutoOrderOid());
    echo "<pre>";
    var_dump($cancel);
    echo "</pre>";
} catch (\ultracart\v2\ApiException $e) {
    echo 'Exception when calling CustomerApi->customerCustomersCustomerProfileOidGet: ', $e->getMessage(), PHP_EOL;
    // THE FOLLOWING LINE PROVIDES DETAILED ERROR INFORMATION
    print_r($e->getResponseObject());
}
?>