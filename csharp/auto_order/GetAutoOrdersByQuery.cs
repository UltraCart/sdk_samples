using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class GetAutoOrdersByQuery
    {
        /*
         * This example illustrates how to retrieve auto orders and handle pagination.
         *
             * These are the possible expansion values for auto orders.  This list is taken from www.ultracart.com/api/
             * and may become stale. Please review the master website when in doubt.
            items
            items.future_schedules
            items.sample_schedule
            original_order
            original_order.affiliate
            original_order.affiliate.ledger
            original_order.auto_order
            original_order.billing
            original_order.buysafe
            original_order.channel_partner
            original_order.checkout
            original_order.coupon
            original_order.customer_profile
            original_order.digital_order
            original_order.edi
            original_order.fraud_score
            original_order.gift
            original_order.gift_certificate
            original_order.internal
            original_order.item
            original_order.linked_shipment
            original_order.marketing
            original_order.payment
            original_order.payment.transaction
            original_order.quote
            original_order.salesforce
            original_order.shipping
            original_order.summary
            original_order.taxes
            rebill_orders
            rebill_orders.affiliate
            rebill_orders.affiliate.ledger
            rebill_orders.auto_order
            rebill_orders.billing
            rebill_orders.buysafe
            rebill_orders.channel_partner
            rebill_orders.checkout
            rebill_orders.coupon
            rebill_orders.customer_profile
            rebill_orders.digital_order
            rebill_orders.edi
            rebill_orders.fraud_score
            rebill_orders.gift
            rebill_orders.gift_certificate
            rebill_orders.internal
            rebill_orders.item
            rebill_orders.linked_shipment
            rebill_orders.marketing
            rebill_orders.payment
            rebill_orders.payment.transaction
            rebill_orders.quote
            rebill_orders.salesforce
            rebill_orders.shipping
            rebill_orders.summary
            rebill_orders.taxes
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            try
            {
                List<AutoOrder> autoOrders = new List<AutoOrder>();

                int iteration = 1;
                int offset = 0;
                int limit = 200;
                bool moreRecordsToFetch = true;

                // Create auto order API instance using API key
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

                while (moreRecordsToFetch)
                {
                    Console.WriteLine($"executing iteration {iteration}");

                    List<AutoOrder> chunkOfOrders = GetAutoOrderChunk(autoOrderApi, offset, limit);
                    autoOrders.AddRange(chunkOfOrders);
                    offset = offset + limit;
                    moreRecordsToFetch = chunkOfOrders.Count == limit;
                    iteration++;
                }

                // Display auto orders
                foreach (var autoOrder in autoOrders)
                {
                    Console.WriteLine(autoOrder);
                }

                Console.WriteLine($"Retrieved {autoOrders.Count} auto orders");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ApiException occurred on iteration");
                Console.WriteLine(ex);
                Environment.Exit(1);
            }
        }

        /// <summary>
        /// Returns a chunk of auto orders based on query parameters
        /// </summary>
        /// <param name="autoOrderApi">The auto order API instance</param>
        /// <param name="offset">Pagination offset</param>
        /// <param name="limit">Maximum number of records to return</param>
        /// <returns>List of matching auto orders</returns>
        public static List<AutoOrder> GetAutoOrderChunk(AutoOrderApi autoOrderApi, int offset, int limit)
        {
            string expand =
                "items,items.future_schedules,original_order,rebill_orders"; // contact us if you're unsure what you need

            /*
             * These are the supported sorting fields:
            auto_order_code
            order_id
            shipping.company
            shipping.first_name
            shipping.last_name
            shipping.city
            shipping.state_region
            shipping.postal_code
            shipping.country_code
            billing.phone
            billing.email
            billing.cc_email
            billing.company
            billing.first_name
            billing.last_name
            billing.city
            billing.state
            billing.postal_code
            billing.country_code
            creation_dts
            payment.payment_dts
            checkout.screen_branding_theme_code
            next_shipment_dts
             */
            
            string sort = "next_shipment_dts";
            AutoOrderQuery query = new AutoOrderQuery();
            query.Email = "support@ultracart.com";
            var apiResponse = autoOrderApi.GetAutoOrdersByQuery(query, limit, offset, sort, expand);

            if (apiResponse.AutoOrders != null)
            {
                return apiResponse.AutoOrders;
            }

            return new List<AutoOrder>();
        }
    }
}