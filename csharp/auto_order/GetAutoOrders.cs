using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class GetAutoOrders
    {
        /*
        getAutoOrders provides a query service on AutoOrders (aka subscriptions or recurring orders) within the UltraCart
        system. It was the first query provided and the most cumbersome to use.  Please use getAutoOrdersByQuery for an
        easier query method.  If you have multiple auto_order_oids and need the corresponding objects, consider
        getAutoOrdersBatch() to reduce call count.
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
                    List<AutoOrder> chunkOfAutoOrders = GetAutoOrderChunk(autoOrderApi, offset, limit);
                    autoOrders.AddRange(chunkOfAutoOrders);
                    offset = offset + limit;
                    moreRecordsToFetch = chunkOfAutoOrders.Count == limit;
                    iteration++;
                }
                
                // Display the auto orders
                foreach (var autoOrder in autoOrders)
                {
                    Console.WriteLine(autoOrder);
                }
                
                Console.WriteLine($"Total auto orders retrieved: {autoOrders.Count}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
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
            string expand = "items,original_order,rebill_orders";
            // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
            /*
            Possible Order Expansions:

            add_ons                             items.sample_schedule	        original_order.buysafe	        original_order.payment.transaction
            items	                            original_order	                original_order.channel_partner	original_order.quote
            items.future_schedules	            original_order.affiliate	    original_order.checkout	        original_order.salesforce
            original_order.affiliate.ledger	    original_order.coupon	        original_order.shipping
            original_order.auto_order	        original_order.customer_profile	original_order.summary
            original_order.billing	            original_order.digital_order	original_order.taxes
            rebill_orders	                    original_order.edi	            rebill_orders.affiliate
            rebill_orders.affiliate.ledger	    original_order.fraud_score	    rebill_orders.auto_order
            rebill_orders.billing	            original_order.gift	            rebill_orders.buysafe
            rebill_orders.channel_partner	    original_order.gift_certificate	rebill_orders.checkout
            rebill_orders.coupon	            original_order.internal	        rebill_orders.customer_profile
            rebill_orders.digital_order	        original_order.item	            rebill_orders.edi
            rebill_orders.fraud_score	        original_order.linked_shipment	rebill_orders.gift
            rebill_orders.gift_certificate      original_order.marketing	    rebill_orders.internal
            rebill_orders.item	                original_order.payment	        rebill_orders.linked_shipment
            rebill_orders.marketing	            rebill_orders.payment	        rebill_orders.quote
            rebill_orders.payment.transaction	rebill_orders.salesforce	    rebill_orders.shipping
            rebill_orders.summary	            rebill_orders.taxes
            */
            
            string autoOrderCode = null;
            string originalOrderId = null;
            string firstName = null;
            string lastName = null;
            string company = null;
            string city = null;
            string state = null;
            string postalCode = null;
            string countryCode = null;
            string phone = null;
            string email = "test@ultracart.com"; // <-- for this example, we are only filtering on email address.
            string originalOrderDateBegin = null;
            string originalOrderDateEnd = null;
            string nextShipmentDateBegin = null;
            string nextShipmentDateEnd = null;
            string cardType = null;
            string itemId = null;
            string status = null;
            string since = null;
            string sort = null;
            
            // see all these parameters?  that is why you should use getAutoOrdersByQuery() instead of getAutoOrders()
            var apiResponse = autoOrderApi.GetAutoOrders(autoOrderCode, originalOrderId, firstName, lastName,
                company, city, state, postalCode, countryCode, phone, email, originalOrderDateBegin,
                originalOrderDateEnd, nextShipmentDateBegin, nextShipmentDateEnd, cardType, itemId, status,
                limit, offset, since, sort, expand);
                
            if (apiResponse.AutoOrders != null)
            {
                return apiResponse.AutoOrders;
            }
            return new List<AutoOrder>();
        }
    }
}