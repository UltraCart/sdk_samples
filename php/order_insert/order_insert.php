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
$simple_key = '630eccdfa6287a01699b80e93de87900b25f1cd52ce6be01699b80e93de87900';
$merchant_id = 'DEMO';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector);
$expansion =
    "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes";


// See https://github.com/UltraCart/hosted_fields for this file.
require_once(__DIR__ . '/HostedFields.class.php');

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

// the hosted field php class may be found here:  https://github.com/UltraCart/hosted_fields
    $hosted_fields = new HostedFields($merchant_id, null);

    $items = array();
    $item = new OrderItem();
    $item->setMerchantItemId("BONE");
    $item->setQuantity(1);

    // This 'Bone' item within the DEMO account has a single item option.
    // To get the name and possible values of, use the Item API and query the item.
    $itemOption = new OrderItemOption();
    $itemOption->setLabel("Addon Treat");
    $itemOption->setValue("No thanks");
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
    $shipping->setLeastCostRoute(true);
    // $shipping->setLeastCostRouteShippingMethods(['ShippingMethodName1', 'ShippingMethodName2']);

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
    $creditCardNumber = "4444333322221111";
    $cvv = "321";

    $payment = new OrderPayment();
    $creditCard = new OrderPaymentCreditCard();
    $store_cc_result = $hosted_fields->store_number($creditCardNumber);
    echo "<br><br>";
    echo print_r($store_cc_result);
    echo "<br><br>";
    if ($store_cc_result->success) {
        // the server will tie the actual card number to the cart later, but the mask must be added
        //$creditCard->setCardNumber($store_cc_result->maskedValue);
        $creditCard->setCardExpirationMonth(3);
        $creditCard->setCardExpirationYear(2020);
        $creditCard->setCardType($store_cc_result->cardType);
        $creditCard->setCardNumberToken($store_cc_result->token);
    }

    $store_cvv_result = $hosted_fields->store_cvv($cvv);
    echo "<br><br>";
    echo print_r($store_cvv_result);
    echo "<br><br>";
    if ($store_cvv_result->success) {
        // the server will tie the actual cvv to the cart later, but the mask must be added
        $creditCard->setCardVerificationNumberToken($store_cvv_result->token);
    }
    $payment->setPaymentMethod("Credit Card");
    $payment->setCreditCard($creditCard);
    $order->setPayment($payment);
    // --- End Payment Block ---

    // add a coupon.
    $coupon = new OrderCoupon();
    $coupon->setCouponCode("10OFF"); // you'll need to create a coupon first, you know?
    $order->setCoupons([$coupon]);


    // channel partner information.  critical.
    $channel_partner = new OrderChannelPartner();
    $channel_partner->setChannelPartnerOrderId("ABC" . rand());
    $channel_partner->setChannelPartnerCode("ABC12");
    $order->setChannelPartner($channel_partner);

    $order_internal = new OrderInternal();
    $order_internal->setSalesRepCode("REPCODE1");
    $order_internal->setMerchantNotes("These are some merchant notes.");

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

