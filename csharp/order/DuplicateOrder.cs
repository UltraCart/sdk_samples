using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class DuplicateOrder
    {
        /// <summary>
        /// OrderApi.DuplicateOrder() does not accomplish much on its own. The use-case for this method is to
        /// duplicate a customer's order and then charge them for it. DuplicateOrder() does not charge the customer again.
        ///
        /// These are the steps for cloning an existing order and charging the customer for it.
        /// 1. DuplicateOrder
        /// 2. UpdateOrder (if you wish to change any part of it)
        /// 3. ProcessPayment to charge the customer.
        ///
        /// As a reminder, if you wish to create a new order from scratch, use the CheckoutApi or ChannelPartnerApi.
        /// The OrderApi is for managing existing orders.
        /// </summary>
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            // For this example, we're going to change the items after we duplicate the order, so
            // the only expansion properties we need are the items.
            // See: https://www.ultracart.com/api/ for a list of all expansions.
            string expansion = "items";

            // Step 1. Duplicate the order
            string orderIdToDuplicate = "DEMO-0009104436";
            OrderResponse apiResponse = orderApi.DuplicateOrder(orderIdToDuplicate, expansion);
            Order newOrder = apiResponse.Order;

            // Step 2. Update the items. I will create a new items array and assign it to the order to remove the old ones completely.
            OrderItem[] items = new OrderItem[1];
            OrderItem item = new OrderItem();
            item.MerchantItemId = "simple_teapot";
            item.Quantity = 1;
            item.Description = "A lovely teapot";
            item.DistributionCenterCode = "DFLT"; // where is this item shipping out of?

            Currency cost = new Currency();
            cost.CurrencyCode = "USD";
            cost.Value = 9.99m;
            item.Cost = cost;

            Weight weight = new Weight();
            weight.Uom = Weight.UomEnum.OZ;
            weight.Value = 6;
            item.Weight = weight;
            
            newOrder.Items = new List<OrderItem>{item};
            OrderResponse updateResponse = orderApi.UpdateOrder(newOrder.OrderId, newOrder, expansion);

            Order updatedOrder = updateResponse.Order;

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
            OrderProcessPaymentResponse paymentResponse = orderApi.ProcessPayment(newOrder.OrderId, processPaymentRequest);
            OrderPaymentTransaction transactionDetails = paymentResponse.PaymentTransaction; // do whatever you wish with this.

            Console.WriteLine("New Order (after updated items):");
            Console.WriteLine(updatedOrder);
            Console.WriteLine("Payment Response:");
            Console.WriteLine(paymentResponse);
        }
    }
}