using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class DuplicateOrder
    {
        // uncomment to run.  C# projects can only have one main.
        // public static void Main()
        // {
        //     var order = DuplicateOrderCall();
        //     Utility.DumpObject(order, "Order");
        // }

        // ReSharper disable once MemberCanBePrivate.Global
        public static Order DuplicateOrderCall()
        {
            // These are the steps for cloning an existing order and charging the customer for it.
            // 1. duplicateOrder
            // 2. updateOrder (if you wish to change any part of it)
            // 3. processPayment to charge the customer.
            //
            // As a reminder, if you wish to create a new order from scratch, use the CheckoutApi.
            // The OrderApi is for managing existing orders.

            var orderApi = new OrderApi(Constants.API_KEY);

            string expansion = "items";
            // for this example, we're going to change the items after we duplicate the order, so
            // the only expansion properties we need are the items.
            // See: https://www.ultracart.com/api/  for a list of all expansions.

            // Step 1. Duplicate the order
            string orderIdToDuplicate = "DEMO-0009104436";
            OrderResponse apiResponse = orderApi.DuplicateOrder(orderIdToDuplicate, expansion);
            Order newOrder = apiResponse.Order;

            // Step 2. Update the items.  I will create a new items array and assign it to the order to remove the old ones completely.
            var orderItems = new List<OrderItem>();

            OrderItem item = new OrderItem
            {
                MerchantItemId = "simple_teapot",
                Quantity = 1,
                Description = "A lovely teapot",
                DistributionCenterCode = "DFLT" // where is this item shipping out of?
            };

            Currency cost = new Currency
            {
                CurrencyCode = "USD",
                Value = (decimal?)9.99
            };
            item.Cost = cost;

            Weight weight = new Weight
            {
                Uom = Weight.UomEnum.OZ,
                Value = 6
            };
            item.Weight = weight;

            newOrder.Items = orderItems;
            OrderResponse updateResponse = orderApi.UpdateOrder(newOrder, newOrder.OrderId, expansion);
            Order updatedOrder = updateResponse.Order;

            // Step 3. process the payment.
            // the request object below takes two optional arguments.
            // The first is an amount if you wish to bill for an amount different from the order.  We do not.
            // The second is card_verification_number_token, which is a token you can create by using our hosted fields to
            // upload a CVV value.  This will create a token you may use here.  However, most merchants using the duplicate
            // order method will be setting up an auto order for a customer.  Those will not make use of the CVV, so we're
            // not including it here.  That is why the request object below is does not have any values set.
            // For more info on hosted fields, see: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
            OrderProcessPaymentRequest request = new OrderProcessPaymentRequest();
            OrderProcessPaymentResponse paymentResponse = orderApi.ProcessPayment(newOrder.OrderId, request);
            OrderPaymentTransaction transactionDetails = paymentResponse.PaymentTransaction;


            return updatedOrder;
        }
    }
}