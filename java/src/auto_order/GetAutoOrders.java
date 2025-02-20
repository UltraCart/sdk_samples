package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.AutoOrder;
import com.ultracart.admin.v2.models.AutoOrdersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetAutoOrders {
    /**
    getAutoOrders provides a query service on AutoOrders (aka subscriptions or recurring orders) within the UltraCart
    system. It was the first query provided and the most cumbersome to use.  Please use getAutoOrdersByQuery for an
    easier query method.  If you have multiple auto_order_oids and need the corresponding objects, consider
    getAutoOrdersBatch() to reduce call count.
    */
    public static void execute() {
        System.out.println("--- " + GetAutoOrders.class.getSimpleName() + " ---");
        
        try {
            List<AutoOrder> autoOrders = new ArrayList<AutoOrder>();
            
            int iteration = 1;
            int offset = 0;
            int limit = 200;
            boolean moreRecordsToFetch = true;
            
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);
            
            while (moreRecordsToFetch) {
                System.out.println("executing iteration " + iteration);
                List<AutoOrder> chunkOfAutoOrders = getAutoOrderChunk(autoOrderApi, offset, limit);
                autoOrders.addAll(chunkOfAutoOrders);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfAutoOrders.size() == limit;
                iteration++;
            }
            
            // Display the auto orders
            for (AutoOrder autoOrder : autoOrders) {
                System.out.println(autoOrder);
            }
            
            System.out.println("Total auto orders retrieved: " + autoOrders.size());
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
    
    /**
     * Returns a chunk of auto orders based on query parameters
     * @param autoOrderApi The auto order API instance
     * @param offset Pagination offset
     * @param limit Maximum number of records to return
     * @return List of matching auto orders
     */
    public static List<AutoOrder> getAutoOrderChunk(AutoOrderApi autoOrderApi, int offset, int limit) throws ApiException {
        String expand = "items,original_order,rebill_orders";
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
        
        String autoOrderCode = null;
        String originalOrderId = null;
        String firstName = null;
        String lastName = null;
        String company = null;
        String city = null;
        String state = null;
        String postalCode = null;
        String countryCode = null;
        String phone = null;
        String email = "test@ultracart.com"; // <-- for this example, we are only filtering on email address.
        String originalOrderDateBegin = null;
        String originalOrderDateEnd = null;
        String nextShipmentDateBegin = null;
        String nextShipmentDateEnd = null;
        String cardType = null;
        String itemId = null;
        String status = null;
        String since = null;
        String sort = null;
        
        // see all these parameters?  that is why you should use getAutoOrdersByQuery() instead of getAutoOrders()
        AutoOrdersResponse apiResponse = autoOrderApi.getAutoOrders(autoOrderCode, originalOrderId, firstName, lastName,
            company, city, state, postalCode, countryCode, phone, email, originalOrderDateBegin,
            originalOrderDateEnd, nextShipmentDateBegin, nextShipmentDateEnd, cardType, itemId, status,
            limit, offset, since, sort, expand);
            
        if (apiResponse.getAutoOrders() != null) {
            return apiResponse.getAutoOrders();
        }
        return new ArrayList<AutoOrder>();
    }
}