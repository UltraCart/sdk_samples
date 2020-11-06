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
// The key below is a dev environment key.  It doesn't exist in production.
$simple_key = '4256aaf6dfedfa01582fe9a961ab0100216d737b874a4801582fe9a961ab0100';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);

$client = new GuzzleHttp\Client(['verify' => false, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$checkout_api = new ultracart\v2\api\CheckoutApi($client, $config, $headerSelector);

// See https://github.com/UltraCart/hosted_fields for this file.
require_once(__DIR__ . '/HostedFields.class.php');

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

function die_if_api_error(\ultracart\v2\models\CartResponse $order_response)
{
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
<pre>
<?php


try {
    $get_response = $checkout_api->getCart($expansion);
    if ($get_response->getErrors() != null && count($get_response->getErrors()) > 0) {
        // handle errors here.
        die('System error.  Could not retrieve shopping cart.');
    } else {
        $cart = $get_response->getCart();
    }

// the hosted field php class may be found here:  https://github.com/UltraCart/hosted_fields
    $hosted_fields = new HostedFields($cart->getMerchantId(), $cart->getCartId());

    $items = array();
    $item = new \ultracart\v2\models\CartItem();
    $item->setItemId("AOITEM");

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
    $creditCardNumber = "4444333322221111";
    $cvv = "321";

    $payment = new \ultracart\v2\models\CartPayment();
    $creditCard = new \ultracart\v2\models\CartPaymentCreditCard();
    $creditCard->setCardExpirationMonth(3);
    $creditCard->setCardExpirationYear(2020);

    $store_cvv_result = $hosted_fields->store_cvv($cvv);
    echo print_r($store_cvv_result);
    if ($store_cvv_result->success) {
        // the server will tie the actual cvv to the cart later, but the mask must be added
        $creditCard->setCardVerificationNumber($store_cvv_result->maskedValue);
    } else {
        die('Credit card CVV upload failed');
    }


    $store_cc_result = $hosted_fields->store_number($creditCardNumber);
    echo print_r($store_cc_result);
    if ($store_cc_result->success) {
        // the server will tie the actual card number to the cart later, but the mask must be added
        $creditCard->setCardNumber($store_cc_result->maskedValue);
        $creditCard->setCardType($store_cc_result->cardType);
    } else {
        die('Credit card upload failed');
    }


    $payment->setPaymentMethod("Credit Card");
    $payment->setCreditCard($creditCard);
    $cart->setPayment($payment);

    echo "After setting payment.<br>";
    echo print_r($cart->getPayment());
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

    echo "After coupon/payment update.<br>";
    echo print_r($cart->getPayment());


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

    echo "After shipping method update.<br>";
    echo print_r($cart->getPayment());


// validate the cart to ensure everything is in order.
    $validation_request = new \ultracart\v2\models\CartValidationRequest();
    $validation_request->setCart($cart); // I don't set the checks variable.  standard checks are usually sufficient.
    $validation_response = $checkout_api->validateCart($validation_request);


    $errors = [];
    $order = null;

    echo print_r($cart);
    if ($validation_response->getErrors() == null || count($validation_response->getErrors()) == 0) {
        $finalizeRequest = new \ultracart\v2\models\CartFinalizeOrderRequest();
        $finalizeRequest->setCart($cart);

        $finalizeResponse = $checkout_api->finalizeOrder($finalizeRequest);

        if (isset($finalizeResponse)) {
            if ($finalizeResponse->getSuccessful()) {
                $order = $finalizeResponse->getOrder();
                echo print_r($order);
            } else {
                $errors = $finalizeResponse->getErrors();
            }
        }

    } else {
        $errors = $validation_response->getErrors();
    }

//     echo print_r($cart);
    if (isset($errors)) {
        if (count($errors) > 0) {
            foreach ($errors as $err) {
                echo "<strong>$err</strong><br>";
            }
        }
    }

} catch (\ultracart\v2\ApiException $e) {
    echo 'Exception when calling CheckoutApi: ', $e->getMessage(), PHP_EOL;
    print_r($e->getResponseObject());

}


?>
<?php echo 'Finished.'; ?>
</body>
</html>

