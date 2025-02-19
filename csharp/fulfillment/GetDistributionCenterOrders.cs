using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fulfillment
{
    public class GetDistributionCenterOrders
    {
        /*
            getDistributionCenterOrders accepts a distribution center code and returns back up to 100 orders that need shipping.
            There is NO pagination with this method call. Once you receive the orders, you should insert them into your
            system, and acknowledge them via the acknowledgeOrders call. After you acknowledge the orders, subsequent calls
            to getDistributionCenterOrders will return another batch of 100 orders.

            The orders that are returned contain only items for THIS distribution center and are by default completely expanded
            with billing, channel_partner, checkout, coupons, customer_profile, edi, gift, gift_certificate, internal,
            items, payment, shipping, summary, taxes

            You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
            unique short string you assign to a DC as an easy mnemonic.

            For more information about UltraCart distribution centers, please see:
            https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

            If you do not know your DC code, query a list of all DC and print them out.
            DistributionCentersResponse result = fulfillmentApi.GetDistributionCenters();
            Console.WriteLine(result);
        */

        public static void Execute()
        {
            FulfillmentApi fulfillmentApi = Samples.GetFulfillmentApi();

            try
            {
                List<string> acknowledgedOrders = new List<string>();
                string distributionCenterCode = "RAMI";
                OrdersResponse result = fulfillmentApi.GetDistributionCenterOrders(distributionCenterCode);
                List<Order> orders = result.Orders;
                foreach (Order order in orders)
                {
                    Console.WriteLine(order);
                    // TODO: do something useful with this order, like adding it to your shipping queue.
                    acknowledgedOrders.Add(order.OrderId);
                }

                // TODO: once you've securely and completely received it into your system, acknowledge the order.
                fulfillmentApi.AcknowledgeOrders(distributionCenterCode, acknowledgedOrders);

                // After acknowledging orders, you should call getDistributionCenterOrders again until you receive zero orders to ship.

                Console.WriteLine("done");
            }
            catch (Exception e)
            {
                // update inventory failed. examine the reason.
                Console.WriteLine("Exception when calling FulfillmentApi.GetDistributionCenterOrders: " + e.Message);
                Environment.Exit(1);
            }
        }


    }
}