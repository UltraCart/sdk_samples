package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;
import common.JSON;

import java.math.BigDecimal;
import java.util.ArrayList;

public class DuplicateOrder{

  public static void execute() throws Exception {

    // These are the steps for cloning an existing order and charging the customer for it.
    // 1. duplicateOrder
    // 2. updateOrder (if you wish to change any part of it)
    // 3. processPayment to charge the customer.
    //
    // As a reminder, if you wish to create a new order from scratch, use the CheckoutApi.
    // The OrderApi is for managing existing orders.

    OrderApi orderApi = new OrderApi(Constants.API_KEY, Constants.VERIFY_SSL_FLAG, Constants.DEBUG_MODE);

    String expansion = "items";
    // for this example, we're going to change the items after we duplicate the order, so
    // the only expansion properties we need are the items.
    // See: https://www.ultracart.com/api/  for a list of all expansions.

    // Step 1. Duplicate the order
    String orderIdToDuplicate = "DEMO-0009104436";
    OrderResponse apiResponse = orderApi.duplicateOrder(orderIdToDuplicate, expansion);
    Order newOrder = apiResponse.getOrder();

    // Step 2. Update the items.  I will create a new items array and assign it to the order to remove the old ones completely.
    ArrayList<OrderItem> orderItems = new ArrayList<>();
    
    OrderItem item = new OrderItem();
    
    item.setMerchantItemId("simple_teapot");
    item.setQuantity(BigDecimal.ONE);
    item.setDescription("A lovely teapot");
    item.setDistributionCenterCode("DFLT"); // where is this item shipping out of?

    Currency cost = new Currency();
    cost.setCurrencyCode("USD");
    cost.setValue(BigDecimal.valueOf(9.99));
    item.setCost(cost);

    Weight weight = new Weight();
    weight.setUom(Weight.UomEnum.OZ);
    weight.setValue(BigDecimal.valueOf(6));
    item.setWeight(weight);

    newOrder.setItems(orderItems);
    OrderResponse updateResponse = orderApi.updateOrder(newOrder.getOrderId(), newOrder, expansion);

    Order updatedOrder = updateResponse.getOrder();

    // Step 3. process the payment.
    // the request object below takes two optional arguments.
    // The first is an amount if you wish to bill for an amount different from the order.  We do not.
    // The second is card_verification_number_token, which is a token you can create by using our hosted fields to
    // upload a CVV value.  This will create a token you may use here.  However, most merchants using the duplicate
    // order method will be setting up an auto order for a customer.  Those will not make use of the CVV, so we're
    // not including it here.  That is why the request object below is does not have any values set.
    // For more info on hosted fields, see: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
    OrderProcessPaymentRequest request = new OrderProcessPaymentRequest();
    OrderProcessPaymentResponse paymentResponse = orderApi.processPayment(newOrder.getOrderId(), request);
    OrderPaymentTransaction transactionDetails = paymentResponse.getPaymentTransaction();
    
    System.out.println(JSON.toJSON(updatedOrder));
    System.out.println(JSON.toJSON(transactionDetails));

  }

}