<?php /** @noinspection DuplicatedCode */

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
 * OrderApi.processPayment() was designed to charge a customer for an order.  It was created to work in tandem with
 * duplicateOrder(), which does not accomplish payment on its own.  The use-case for this method is to
 * duplicate a customer's order and then charge them for it.  duplicateOrder() does not charge the customer again,
 * which is why processPayment() exists.
 *
 * These are the steps for cloning an existing order and charging the customer for it.
 * 1. duplicateOrder
 * 2. updateOrder (if you wish to change any part of it)
 * 3. processPayment to charge the customer.
 *
 * As a reminder, if you wish to create a new order from scratch, use the CheckoutApi or ChannelPartnerApi.
 * The OrderApi is for managing existing orders.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderItem;
use ultracart\v2\models\Currency;
use ultracart\v2\models\Weight;
use ultracart\v2\models\OrderProcessPaymentRequest;

$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$expansion = "items";   // for this example, we're going to change the items after we duplicate the order, so
// the only expansion properties we need are the items.
// See: https://www.ultracart.com/api/  for a list of all expansions.

// Step 1. Duplicate the order
$order_id_to_duplicate = 'DEMO-0009104436';
$api_response = $order_api->duplicateOrder($order_id_to_duplicate, $expansion);
$new_order = $api_response->getOrder();

// Step 2. Update the items.  I will create a new items array and assign it to the order to remove the old ones completely.
$items = array();
$item = new OrderItem();
$item->setMerchantItemId('simple_teapot');
$item->setQuantity(1);
$item->setDescription("A lovely teapot");
$item->setDistributionCenterCode('DFLT'); // where is this item shipping out of?

$cost = new Currency();
$cost->setCurrencyCode('USD');
$cost->setValue(9.99);
$item->setCost($cost);

$weight = new Weight();
$weight->setUom("OZ");
$weight->setValue(6);
$item->setWeight($weight);

$items[] = $item;
$new_order->setItems($items);
$update_response = $order_api->updateOrder($new_order->getOrderId(), $new_order, $expansion);

$updated_order = $update_response->getOrder();

// Step 3. process the payment.
// the request object below takes two optional arguments.
// The first is an amount if you wish to bill for an amount different from the order.
// We do not bill differently in this example.
// The second is card_verification_number_token, which is a token you can create by using our hosted fields to
// upload a CVV value.  This will create a token you may use here.  However, most merchants using the duplicate
// order method will be setting up an auto order for a customer.  Those will not make use of the CVV, so we're
// not including it here.  That is why the request object below is does not have any values set.
// For more info on hosted fields:
// See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
// See: https://github.com/UltraCart/sdk_samples/blob/master/hosted_fields/hosted_fields.html

$process_payment_request = new OrderProcessPaymentRequest();
$payment_response = $order_api->processPayment($new_order->getOrderId(), $process_payment_request);
$transaction_details = $payment_response->getPaymentTransaction(); // do whatever you wish with this.

echo '<html lang="en"><body><pre>';
echo 'New Order (after updated items):<br>';
var_dump($updated_order);
echo '<br>Payment Response:<br>';
var_dump($payment_response);
echo '</pre></body></html>';