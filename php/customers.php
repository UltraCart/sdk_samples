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

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);


$api = new ultracart\v2\api\CustomerApi($client, $config, $headerSelector);
?>

<?php

/**
 * returns a block of customers
 * @param \ultracart\v2\api\CustomerApi $api
 * @param int $offset pagination variable
 * @param int $limit pagination variable.  max server will allow is 200
 * @return array|\ultracart\v2\models\Customer[]
 * @throws \ultracart\v2\ApiException
 */
function get_customer_chunk(\ultracart\v2\api\CustomerApi $api, int $offset = 0, int $limit = 200) {

    $_limit = $limit;
    $_offset = $offset;
    $_since = null;
    $_sort = null;

    $_expand = "shipping,billing"; // shipping and billing addresses
    // Two of the other many possible expansions ...
    // $_expand = null; // no expansion.  bare bones.
    // $_expand = "shipping,billing,cards,pricing_tiers"; // everything.

    $query = new \ultracart\v2\models\CustomerQuery();

    $get_response = $api->getCustomersByQuery($query, $_limit, $_offset, $_since, $_sort, $_expand);
    if($get_response->getSuccess()){
        return $get_response->getCustomers();
    }

    return array();
}

?>

<html>
<body>

<?php
$customers = array();
try {

    $iteration = 1;
    $offset = 0;
    $limit = 200;
    $need_more_records = true;
    while($need_more_records){

        echo "executing iteration #" . $iteration++ . "<br>";
        $block_of_customers = get_customer_chunk($api, $offset, $limit);
        foreach($block_of_customers as $customer){
            array_push($customers, $customer);
        }

        $offset += $limit;
        $need_more_records = count($block_of_customers) == $limit;
        sleep(1);
    }

} catch (\ultracart\v2\ApiException $e) {
    echo 'API Exception when calling CustomerApi->getCustomers: ', $e->getMessage(), PHP_EOL;
    echo print_r($e->getResponseBody()), PHP_EOL;
} catch (Exception $e) {
    echo 'Exception when calling CustomerApi->getCustomers: ', $e->getMessage(), PHP_EOL;
}

?>
<?php $counter = 1; ?>
<?php if(isset($customers)){ ?>
    <?php foreach($customers as $customer){ ?>
        <?php echo "$counter. " . $customer->getEmail() . "<br>"; ?>
        <?php $counter++; ?>
    <?php } ?>
<?php } ?>
</body>
</html>
