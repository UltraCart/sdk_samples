
<?php
// Example: Querying orders by refund date
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
// for testing and development only
use ultracart\v2\HeaderSelector;
use ultracart\v2\models\OrderQuery;
use ultracart\v2\models\OrdersResponse;

set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>


<?php
// initialization code
require_once './vendor/autoload.php';
// The key below is a dev environment key.  It doesn't exist in production.
$simple_key = '630eccdfa6287a01699b80e93de87900b25f1cd52ce6be01699b80e93de87900';
$merchant_id = 'DEMO';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);

$expansion =
    "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes";

function die_if_api_error(OrdersResponse $orders_response)
{
    if ($orders_response->getError() != null) {
        echo "Error:<br>";
        echo $orders_response->getError() . '<br>';
        die('handle this error gracefully');
    }
}

?>
<?php

try {

    $refund_start_dts = new DateTime('01 Jan 2014');
    $refund_end_dts = new DateTime('01 Jan 2020');

    $order_query = new OrderQuery();
    $order_query->setRefundDateBegin($refund_start_dts->format('c'));
    $order_query->setRefundDateEnd($refund_end_dts->format('c'));

    $_limit = null;
    $_offset = null;
    $_sort = null;
    $_expand =
        "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes";

    $result = $order_api->getOrdersByQuery($order_query, $_limit, $_offset, $_sort, $_expand);
    echo '<pre>';
    print_r($result);

} catch (Exception $e) {
    echo 'Exception when calling OrderApi->orderOrdersGet: ',
    $e->getMessage(), PHP_EOL;
}
