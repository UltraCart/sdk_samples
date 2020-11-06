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
require_once '../vendor/autoload.php';
// The key below is a dev environment key.  It doesn't exist in production.
$simple_key = '0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100';
$merchant_id = 'DEMO';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
$expansion =
    "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes";

function die_if_api_error(OrderResponse $order_response)
{
    if ($order_response->getError() != null) {
        echo "Error:<br>";
        echo $order_response->getError() . '<br>';
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

    $order = new Order();

    // channel partner information.  critical.
    $channel_partner = new OrderChannelPartner();
    $channel_partner->setChannelPartnerOrderId("ABC" . rand());
    $channel_partner->setChannelPartnerCode("ABC12");
    $channel_partner->setNoRealtimePaymentProcessing(true);
    $channel_partner->setSkipPaymentProcessing(true); // this order has already been transacted
    $channel_partner->setStoreCompleted(true); // bypass shipping and mark the order as completely finished.

    // TODO add arbitrary values where applicable.

    $order->setChannelPartner($channel_partner);

    $items = array();
    $item = new OrderItem();
    $item->setMerchantItemId("TEST");
    $item->setQuantity(1);
    // only use if you need to change the cost of the item.  It is NOT normal to need arbitrary costs.
    $item->setArbitraryUnitCost(new Currency(['value' => 0.00]));

    // when instructing UltraCart to store an order as completed, we must specify last auto bill dates for all auto
    // orders. The following lines are only needed when a completed order has recurring (auto order) products
//    $datetime = new DateTime('17 Mar 2020');
//    $item->setAutoOrderLastRebillDts($datetime->format('c')); // date must be in ISO8601 format

    // This 'TEST' item within the DEMO account has a single item option.
    // To get the name and possible values of, use the Item API and query the item.
    $itemOption = new OrderItemOption();
    $itemOption->setLabel("Ship One Disc");
    $itemOption->setValue("No");
    $item->setOptions([$itemOption]);

    array_push($items, $item);
    $order->setItems($items);

    $shipping = new OrderShipping();
    $shipping->setCompany("UltraCart");
    $shipping->setFirstName("Perry");
    $shipping->setLastName("Smith");
    $shipping->setAddress1("55 Main Street");
    $shipping->setAddress2("Suite 101");
    $shipping->setCity("Duluth");
    $shipping->setPostalCode("30097");
    $shipping->setStateRegion("GA");
    $shipping->setCountryCode("US");
    $shipping->setDayPhone("555-555-1234");
    $shipping->setEveningPhone("444-333-4321");

    // there are two ways to specify shipping.
    // 1) explicitly name the shipping method and costs
    // 2) set the flag instructing UltraCart to use the cheapest method
    // if this order was already finalized outside of the system, you must do the former and specify all values.
    // $shipping->setLeastCostRoute(true);
    // $shipping->setLeastCostRouteShippingMethods(['ShippingMethodName1', 'ShippingMethodName2']); // this is optional

    $shipping->setShippingMethod('UPS: Ground');
    // if you need to override the shipping costs, that is done in the OrderSummary object.

    $order->setShipping($shipping);


    $billing = new OrderBilling();
    $billing->setCompany("UltraCart");
    $billing->setFirstName("Perry");
    $billing->setLastName("Smith");
    $billing->setAddress1("55 Main Street");
    $billing->setAddress2("Suite 101");
    $billing->setCity("Duluth");
    $billing->setPostalCode("30097");
    $billing->setStateRegion("GA");
    $billing->setCountryCode("US");
    $billing->setDayPhone("555-555-1234");
    $billing->setEveningPhone("444-333-4321");
    $billing->setEmail("test@ultracart.com");
    $order->setBilling($billing);

    // --- Payment Block ---
    $payment = new OrderPayment();
    $payment->setPaymentMethod( OrderPayment::PAYMENT_METHOD_CASH);
    $payment->setTestOrder(true);
    $order->setPayment($payment);
    // --- End Payment Block ---

    // add a coupon.
//    $coupon = new OrderCoupon();
//    $coupon->setCouponCode("10OFF"); // you'll need to create a coupon first, you know?
//    $order->setCoupons([$coupon]);



//    $order_internal = new OrderInternal();
//    $order_internal->setSalesRepCode("REPCODE1");
//    $order_internal->setMerchantNotes("These are some merchant notes.");


    // this block is only needed if you've used arbitrary item costs (different from what UltraCart has)
    // or different taxes.  It is not normal to need $order_summary
    $order_summary = new OrderSummary();
    $order_summary->setArbitraryShippingHandlingTotal(new Currency(['value'=>0.00]));
    $order->setSummary($order_summary);

    // this block is only needed if charged tax differently from what UltraCart would charge
    // it is NOT normal to need $order_taxes
    $order_taxes = new OrderTaxes();
    $order_taxes->setArbitraryTax(0.00);
    $order->setTaxes($order_taxes);

    $order_response = $order_api->insertOrder($order, $expansion);

    die_if_api_error($order_response);
    $new_order = $order_response->getOrder();

} catch (ApiException $e) {
    echo "<pre>" . print_r($e) . "</pre><br><br>";
    die($e->getMessage());
}


?>
<?php
if (isset($order)) {
    echo print_r($order);
}
?>
<?php
if (isset($new_order)) {
    echo print_r($new_order);
}
?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

