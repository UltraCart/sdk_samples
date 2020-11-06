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
$simple_key = '79858820020464015cc18e2966051b008410a8d10ef429015cc18e2966051b00';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);

// ----------------------------------------------------------------------------------
// expansion should contain all the objects that will be needed throughout the checkout.
// see https://www.ultracart.com/api/#Topic3 for the complete list.
// This expansion list should be supplied for each get/put throughout or data may be lost on the return objects.
$expansion = "all";
// The expansion above doesn't include much of the item objects because they're not needed.  For example, we don't
// need the item multimedia because we're not showing this cart to an end customer like a javascript implementation would
// if you needed to show images and such to a customer, then add 'items' to the csv above.  Better, yet, if you need to do
// all that, use javascript instead.
// ----------------------------------------------------------------------------------

function die_if_api_error(\ultracart\v2\models\OrderResponse $order_response){
    if ($order_response->getError() != null) {
        echo $order_response->getError() . '<br>';
        die('handle this error gracefully');
    }
}


?>

<!DOCTYPE html>
<html>
<body>
<?php

    $order_response = $order_api->getOrder('SCIND-2018315451');
    $order = $order_response->getOrder();

?>
<pre>
<?php
if (count($errors) > 0) {
    foreach ($errors as $err) {
        echo "<strong>$err</strong><br>";
    }
}
?>
<?php echo print_r($cart); ?>
<?php echo print_r($validation_response); ?>
<?php echo print_r($store_cc_result); ?>
<?php echo print_r($store_cvv_result); ?>
<?php if (isset($finalizeResponse)) {
    echo print_r($finalizeResponse);
} ?>
<?php if ($order != null) {
    echo print_r($order);
} ?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

