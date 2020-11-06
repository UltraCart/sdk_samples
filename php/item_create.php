<?php
// Example: Inserting a channel partner order into the UltraCart system and charging a credit card during the insert.
// Requirement: An API Key: https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
// Requirement: A Channel Partner Code: https://secure.ultracart.com/merchant/configuration/customChannelPartnerListLoad.do
// This is used to take orders from another system and insert them into the UltraCart system.
// This is NOT to be used for customer real-time orders.  Use the CheckoutApi for that.  It is vastly superior in every way.
?>


<?php
// Did you get an error?
// See this: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/39077885/Troubleshooting+API+Errors
?>

<?php

use ultracart\v2\ApiException;
use ultracart\v2\HeaderSelector;
use ultracart\v2\models\Currency;
use ultracart\v2\models\Item;
use ultracart\v2\models\ItemPricing;
use ultracart\v2\models\ItemResponse;
use ultracart\v2\models\ItemShipping;
use ultracart\v2\models\ItemShippingDistributionCenter;
use ultracart\v2\models\Order;
use ultracart\v2\models\OrderBilling;
use ultracart\v2\models\OrderChannelPartner;
use ultracart\v2\models\OrderCoupon;
use ultracart\v2\models\OrderInternal;
use ultracart\v2\models\OrderItem;
use ultracart\v2\models\OrderItemOption;
use ultracart\v2\models\OrderPayment;
use ultracart\v2\models\OrderPaymentCreditCard;
use ultracart\v2\models\OrderResponse;
use ultracart\v2\models\OrderShipping;
use ultracart\v2\models\OrderSummary;
use ultracart\v2\models\OrderTaxes;

// for testing and development only
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>


<?php
// initialization code
require_once 'vendor/autoload.php';
// The key below is a dev environment key.  It doesn't exist in production.
$simple_key = '0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100';
$merchant_id = 'DEMO';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new HeaderSelector(/* leave null for version tied to this sdk version */);

$item_api = new ultracart\v2\api\ItemApi($client, $config, $headerSelector);

function die_if_api_error(ItemResponse $item_response)
{
    if ($item_response->getError() != null) {
        echo "Error:<br>";
        echo $item_response->getError() . '<br>';
        die('handle this error gracefully');
    }
}

?>

<!DOCTYPE html>
<html>
<body>
<pre>
<?php


try {

    $item = $item_api->getItemByMerchantItemId("API_DC_TEST2","shipping.distribution_centers");
//    $item = new Item();
//
//    $item->setDescription("API DC Test2");
//    $item->setMerchantItemId("API_DC_TEST2");
//    $item_pricing = new ItemPricing();
//    $item_pricing->setCost(12.99);
//    $item->setPricing($item_pricing);

    $dc = new ItemShippingDistributionCenter();
    $dc->setDistributionCenterCode("DFLT");
    $dc->setHandles(true);
    $dc->setInventoryLevel(1000);

    $item_shipping = new ItemShipping();
    $item_shipping->setDistributionCenters(array($dc));
    $item->setShipping($item_shipping);

    $item_response = $item_api->updateItem($item);

    die_if_api_error($item_response);

} catch (ApiException $e) {
    echo "<pre>" . print_r($e) . "</pre><br><br>";
    die($e->getMessage());
}


?>
<?php
if (isset($item)) {
    echo print_r($item);
}
if (isset($item_response)) {
    echo print_r($item_response);
}
?>
?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

