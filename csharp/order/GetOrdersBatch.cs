using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrdersBatch
    {
        /*
         * This method is useful when you need to query a defined set of orders and would like to avoid querying them
         * one at a time.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string expansion = "item,summary,billing,shipping,shipping.tracking_number_details";
            // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
            /*
            Possible Order Expansions:
            affiliate           affiliate.ledger                    auto_order
            billing             channel_partner                     checkout
            coupon              customer_profile                    digital_order
            edi                 fraud_score                         gift
            gift_certificate    internal                            item
            linked_shipment     marketing                           payment
            payment.transaction quote                               salesforce
            shipping            shipping.tracking_number_details    summary
            taxes
            */

            OrderQueryBatch orderBatch = new OrderQueryBatch();
            List<string> orderIds = new List<string> { "DEMO-0009104390", "DEMO-0009104391", "DEMO-0009104392" };
            orderBatch.OrderIds = orderIds;

            OrdersResponse apiResponse = orderApi.GetOrdersBatch(orderBatch, expansion);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            List<Order> orders = apiResponse.Orders;
            if (orders.Count == 0)
            {
                Console.Error.WriteLine("There were no orders returned by this query.");
            }

            // do something with the orders. for this example, we're just accessing many properties as illustration.
            foreach (Order order in orders)
            {
                OrderSummary summary = order.Summary;
                decimal actualShippingCost = summary.ActualShipping?.Localized ?? 0m;

                Order.CurrentStageEnum? currentStage = order.CurrentStage;
                OrderShipping sAddr = order.Shipping;
                List<string> trackingNumbers = sAddr.TrackingNumbers;
                foreach (string trackingNumber in trackingNumbers)
                {
                    // do something with tracking number here.
                }

                // Here's how to access the shipping information.  Do something with the variables.
                string sfname = order.Shipping.FirstName;
                string slname = order.Shipping.LastName;
                string saddress1 = order.Shipping.Address1;
                string saddress2 = order.Shipping.Address2;
                string scity = order.Shipping.City;
                string sregion = order.Shipping.StateRegion;
                string sccode = order.Shipping.CountryCode;
                string spcode = order.Shipping.PostalCode;
                string sdayphone = order.Shipping.DayPhone;
                string shippingMethod = order.Shipping.ShippingMethod;

                // Here's how to access the billing information.  Do something with the variables.
                string billingAddress1 = order.Billing.Address1;
                string billingAddress2 = order.Billing.Address2;
                string billingCity = order.Billing.City;
                string billingStateRegion = order.Billing.StateRegion;
                string billingCountryCode = order.Billing.CountryCode;
                string billingPostalCode = order.Billing.PostalCode;
                string email = order.Billing.Email; // email is located on the billing object.

                // here is how to access the items
                List<OrderItem> items = order.Items;
                foreach (OrderItem item in items)
                {
                    decimal qty = item.Quantity;
                    string itemId = item.MerchantItemId;
                    string description = item.Description;
                    decimal cost = item.Cost.Localized;
                    string costFormatted = item.Cost.LocalizedFormatted; // cost with symbols.
                }
            }

            // this could get verbose depending on the size of your batch ...
            foreach (Order order in orders)
            {
                Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));                
            }
            
        }
    }
}