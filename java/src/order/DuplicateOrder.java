package order;

import com.sun.org.apache.xpath.internal.operations.Or;
import com.ultracart.admin.v2.GiftCertificateApi;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.GiftCertificate;
import com.ultracart.admin.v2.models.GiftCertificateResponse;
import common.Constants;
import common.JSON;

public class DuplicateOrder{

  public static void main(String ... args) throws Exception {

    // These are the steps for cloning an existing order and charging the customer for it.
    // 1. duplicateOrder
    // 2. updateOrder (if you wish to change any part of it)
    // 3. processPayment to charge the customer.
    //
    // As a reminder, if you wish to create a new order from scratch, use the CheckoutApi.
    // The OrderApi is for managing existing orders.

    OrderApi orderApi = new OrderApi(Constants.API_KEY);

    String expansion = "items";
    // for this example, we're going to change the items after we duplicate the order, so
    // the only expansion properties we need are the items.
    // See: https://www.ultracart.com/api/  for a list of all expansions.

    // Step 1. Duplicate the order
    String orderIdToDuplicate = "DEMO-0009104436";
    String apiResponse = orderApi.duplicateOrder(orderIdToDuplicate, expansion);
    $new_order = $api_response->getOrder();

    // Step 2. Update the items.  I will create a new items array and assign it to the order to remove the old ones completely.
    $items = array();
    $item = new ultracart\v2\models\OrderItem();
    $item->setMerchantItemId('simple_teapot');
    $item->setQuantity(1);
    $item->setDescription("A lovely teapot");
    $item->setDistributionCenterCode('DFLT'); // where is this item shipping out of?

    $cost = new \ultracart\v2\models\Currency();
    $cost->setCurrencyCode('USD');
    $cost->setValue(9.99);
    $item->setCost($cost);

    $weight = new \ultracart\v2\models\Weight();
    $weight->setUom("OZ");
    $weight->setValue(6);
    $item->setWeight($weight);

    $items[] = $item;
    $new_order->setItems($items);
    $update_response = $order_api->updateOrder($new_order, $new_order->getOrderId(), $expansion);

    $updated_order = $update_response->getOrder();

    // Step 3. process the payment.
    // the request object below takes two optional arguments.
    // The first is an amount if you wish to bill for an amount different from the order.  We do not.
    // The second is card_verification_number_token, which is a token you can create by using our hosted fields to
    // upload a CVV value.  This will create a token you may use here.  However, most merchants using the duplicate
    // order method will be setting up an auto order for a customer.  Those will not make use of the CVV, so we're
    // not including it here.  That is why the request object below is does not have any values set.
    // For more info on hosted fields, see: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
    $process_payment_request = new \ultracart\v2\models\OrderProcessPaymentRequest();
    $payment_response = $order_api->processPayment($new_order->getOrderId(), $process_payment_request);
    $transaction_details = $payment_response->getPaymentTransaction(); // do whatever you wish with this.

    echo '<html lang="en"><body><pre>';
    echo 'New Order (after updated items):<br>';
    var_dump($updated_order);
    echo '<br>Payment Response:<br>';
    var_dump($payment_response);
    echo '</pre></body></html>';



    System.out.println(JSON.toJSON(giftCertificate));

  }

}