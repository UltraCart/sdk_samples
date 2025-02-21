package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProcessPayment {
    /*
     * OrderApi.processPayment() was designed to charge a customer for an order. It was created to work in tandem with
     * duplicateOrder(), which does not accomplish payment on its own. The use-case for this method is to
     * duplicate a customer's order and then charge them for it. duplicateOrder() does not charge the customer again,
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
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(Constants.API_KEY);

        String expansion = "items";   // for this example, we're going to change the items after we duplicate the order, so
                                     // the only expansion properties we need are the items.
                                     // See: https://www.ultracart.com/api/  for a list of all expansions.

        // Step 1. Duplicate the order
        String orderIdToDuplicate = "DEMO-0009104436";
        OrderResponse apiResponse = orderApi.duplicateOrder(orderIdToDuplicate, expansion);
        Order newOrder = apiResponse.getOrder();

        // Step 2. Update the items. I will create a new items list and assign it to the order to remove the old ones completely.
        List<OrderItem> items = new ArrayList<>();
        OrderItem item = new OrderItem();
        item.setMerchantItemId("simple_teapot");
        item.setQuantity(BigDecimal.valueOf(1.0));
        item.setDescription("A lovely teapot");
        item.setDistributionCenterCode("DFLT"); // where is this item shipping out of?

        Currency cost = new Currency();
        cost.setCurrencyCode("USD");
        cost.setValue(BigDecimal.valueOf(9.99));
        item.setCost(cost);

        Weight weight = new Weight();
        weight.setUom(Weight.UomEnum.OZ);
        weight.setValue(BigDecimal.valueOf(6.0));
        item.setWeight(weight);

        items.add(item);
        newOrder.setItems(items);
        OrderResponse updateResponse = orderApi.updateOrder(newOrder.getOrderId(), newOrder, expansion);

        Order updatedOrder = updateResponse.getOrder();

        // Step 3. process the payment.
        // the request object below takes two optional arguments.
        // The first is an amount if you wish to bill for an amount different from the order.
        // We do not bill differently in this example.
        // The second is card_verification_number_token, which is a token you can create by using our hosted fields to
        // upload a CVV value. This will create a token you may use here. However, most merchants using the duplicate
        // order method will be setting up an auto order for a customer. Those will not make use of the CVV, so we're
        // not including it here. That is why the request object below is does not have any values set.
        // For more info on hosted fields:
        // See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
        // See: https://github.com/UltraCart/sdk_samples/blob/master/hosted_fields/hosted_fields.html

        OrderProcessPaymentRequest processPaymentRequest = new OrderProcessPaymentRequest();
        OrderProcessPaymentResponse paymentResponse = orderApi.processPayment(newOrder.getOrderId(), processPaymentRequest);
        OrderPaymentTransaction transactionDetails = paymentResponse.getPaymentTransaction(); // do whatever you wish with this.

        System.out.println("New Order (after updated items):");
        displayOrderInfo(updatedOrder);
        System.out.println("\nPayment Response:");
        displayPaymentResponse(paymentResponse);
    }

    private static void displayOrderInfo(Order order) {
        System.out.println("Order ID: " + order.getOrderId());
        System.out.println("Total: " + order.getSummary().getTotal().getValue() + " " + 
                          order.getSummary().getTotal().getCurrencyCode());
        System.out.println("Items:");
        for (OrderItem item : order.getItems()) {
            System.out.println("  - " + item.getQuantity() + "x " + item.getDescription() + 
                             " (" + item.getMerchantItemId() + ")");
            System.out.println("    Cost: " + item.getCost().getValue() + " " + 
                             item.getCost().getCurrencyCode());
        }
    }

    private static void displayPaymentResponse(OrderProcessPaymentResponse response) {
        System.out.println("Successfully Processed: " + response.getSuccess());
        if (response.getPaymentTransaction() != null) {
            System.out.println("Transaction ID: " + response.getPaymentTransaction().getTransactionId());
            System.out.println("Transaction Timestamp: " + response.getPaymentTransaction().getTransactionTimestamp());
        }

        // here's the entire object:
        System.out.println(response.toString());

        if (response.getError() != null) {
            System.out.println("Error: " + response.getError().getUserMessage());
        }
    }
}