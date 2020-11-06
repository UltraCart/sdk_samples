<?php /* docs.ultracart.com sample */ ?>
<?php https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/365658113/PHP+SDK+Sample+Add+externally+created+order ?>
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
// The key below is a dev environment key.  It doesn't exist in production.
$simple_key = '4256aaf6dfedfa01582fe9a961ab0100216d737b874a4801582fe9a961ab0100';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$checkout_api = new ultracart\v2\api\CheckoutApi($client, $config, $headerSelector);

// ----------------------------------------------------------------------------------
// expansion should contain all the objects that will be needed throughout the checkout.
// see https://www.ultracart.com/api/#Topic3 for the complete list.
// This expansion list should be supplied for each get/put throughout or data may be lost on the return objects.
$expansion = "billing,checkout,coupons,items,payment,settings.shipping.estimates,shipping,summary,taxes,coupons";
// The expansion above doesn't include much of the item objects because they're not needed.  For example, we don't
// need the item multimedia because we're not showing this cart to an end customer like a javascript implementation would
// if you needed to show images and such to a customer, then add 'items' to the csv above.  Better, yet, if you need to do
// all that, use javascript instead.
// ----------------------------------------------------------------------------------

function die_if_api_error(\ultracart\v2\models\CartResponse $order_response){
    if ($order_response->getErrors() != null) {
        echo "Errors:<br>";
        foreach ($order_response->getErrors() as $error) {
            echo $error . '<br>';
        }
        die('handle this error gracefully');
    }
}


?>

<!DOCTYPE html>
<html>
<body>
<?php

try {
    $get_response = $checkout_api->getCart($expansion);
if($get_response->getErrors() != null &&  count($get_response->getErrors()) > 0){
    // handle errors here.
    die('System error.  Could not retrieve shopping cart.');
} else {
    $cart = $get_response->getCart();
}

$items = array();
$item = new \ultracart\v2\models\CartItem();
$item->setItemId("BONE");

// This 'Bone' item within the DEMO account has a single item option.
// To get the name and possible values of, use the Item API and query the item.
$itemOption = new \ultracart\v2\models\CartItemOption();
$itemOption->setName("Addon Treat");
$itemOption->setSelectedValue("No thanks");
$item->setOptions([$itemOption]);

array_push($items, $item);
$cart->setItems($items);

$shipping = new \ultracart\v2\models\CartShipping();
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
$cart->setShipping($shipping);

$billing = new \ultracart\v2\models\CartBilling();
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
$cart->setBilling($billing);

// --- Payment Block ---
$payment = new \ultracart\v2\models\CartPayment();
$purchaseOrder = new ultracart\v2\models\CartPaymentPurchaseOrder();
$purchaseOrderNumber = "1234567890"; // this should be the order id from the external system.
$purchaseOrder->setPurchaseOrderNumber($purchaseOrderNumber);

$payment->setPaymentMethod("Purchase Order");
$payment->setPurchaseOrder($purchaseOrder);
$cart->setPayment($payment);
// --- End Payment Block ---

// add a coupon.
$coupon = new \ultracart\v2\models\CartCoupon();
$coupon->setCouponCode("10OFF"); // you'll need to create a coupon first, you know?
$cart->setCoupons([$coupon]);


// for best results, set the shipping address and update the server before
// setting the shipping method.  the cart that is returned below will have
// the optimal shipping method estimates and ensure that you don't error
// by selecting a shipping method that is somehow excluded from the possible
// list for whatever reason (restrictions, locations, item-level constraints, etc)
$put_response = $checkout_api->updateCart($cart, $expansion);
$cart = $put_response->getCart();

// for shipping, check the estimates and select one.  for a completely non-interactive checkout such as this,
// the shipping method will either be known beforehand (hard-coded) or use the least expensive method.  The
// least expensive method is always the first one, so for this example, I'll select the first shipping method.
if ($cart->getSettings() != null && $cart->getSettings()->getShipping() != null) {
    $shippingSettings = $cart->getSettings()->getShipping();
    $estimates = $shippingSettings->getEstimates();
    if ($estimates != null && count($estimates) > 0) {
        $cart->getShipping()->setShippingMethod($estimates[0]->getName());
    }
}

$put_response = $checkout_api->updateCart($cart, $expansion);
$cart = $put_response->getCart();

// validate the cart to ensure everything is in order.
$validation_request = new \ultracart\v2\models\CartValidationRequest();
$validation_request->setCart($cart); // I don't set the checks variable.  standard checks are usually sufficient.
$validation_response = $checkout_api->validateCart($validation_request);


$errors = [];
$order = null;

if ($validation_response->getErrors() == null || count($validation_response->getErrors()) == 0) {
    $finalizeRequest = new \ultracart\v2\models\CartFinalizeOrderRequest();
    $finalizeRequest->setCart($cart);
    $finalizeResponse = $checkout_api->finalizeOrder($finalizeRequest);

    if (isset($finalizeResponse)) {
        if ($finalizeResponse->getSuccessful()) {
            $order = $finalizeResponse->getOrder();
        } else {
            $errors = $finalizeResponse->getErrors();
        }
    }

} else {
    $errors = $validation_response->getErrors();
}

} catch (\ultracart\v2\ApiException $e) {
    echo "<pre>" . print_r($e) . "</pre>";
    die("ApiException prevented further execution.");
}

if (count($errors) > 0) {
    foreach ($errors as $err) {
        echo "<strong>$err</strong><br>";
    }
}
?>
<pre>
<?php echo print_r($cart); ?>
<?php echo print_r($validation_response); ?>
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

