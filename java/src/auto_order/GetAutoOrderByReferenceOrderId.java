package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;

public class GetAutoOrderByReferenceOrderId {
    /**
     * This example illustrates how to query an auto order when you know the original order id.
     * These are the possible expansion values for auto orders.  This list is taken from www.ultracart.com/api/
     * and may become stale. Please review the master website when in doubt.
     * items
     * items.future_schedules
     * items.sample_schedule
     * original_order
     * original_order.affiliate
     * original_order.affiliate.ledger
     * original_order.auto_order
     * original_order.billing
     * original_order.buysafe
     * original_order.channel_partner
     * original_order.checkout
     * original_order.coupon
     * original_order.customer_profile
     * original_order.digital_order
     * original_order.edi
     * original_order.fraud_score
     * original_order.gift
     * original_order.gift_certificate
     * original_order.internal
     * original_order.item
     * original_order.linked_shipment
     * original_order.marketing
     * original_order.payment
     * original_order.payment.transaction
     * original_order.quote
     * original_order.salesforce
     * original_order.shipping
     * original_order.summary
     * original_order.taxes
     * rebill_orders
     * rebill_orders.affiliate
     * rebill_orders.affiliate.ledger
     * rebill_orders.auto_order
     * rebill_orders.billing
     * rebill_orders.buysafe
     * rebill_orders.channel_partner
     * rebill_orders.checkout
     * rebill_orders.coupon
     * rebill_orders.customer_profile
     * rebill_orders.digital_order
     * rebill_orders.edi
     * rebill_orders.fraud_score
     * rebill_orders.gift
     * rebill_orders.gift_certificate
     * rebill_orders.internal
     * rebill_orders.item
     * rebill_orders.linked_shipment
     * rebill_orders.marketing
     * rebill_orders.payment
     * rebill_orders.payment.transaction
     * rebill_orders.quote
     * rebill_orders.salesforce
     * rebill_orders.shipping
     * rebill_orders.summary
     * rebill_orders.taxes
     */
    public static void execute() {
        System.out.println("--- " + GetAutoOrderByReferenceOrderId.class.getSimpleName() + " ---");

        try {
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);

            String expand =
                "items,items.future_schedules,original_order,rebill_orders"; // contact us if you're unsure what you need
            String originalOrderId = "DEMO-12345678";
            AutoOrderResponse apiResponse = autoOrderApi.getAutoOrderByReferenceOrderId(originalOrderId, expand);
            AutoOrder autoOrder = apiResponse.getAutoOrder();

            // this will be verbose...
            System.out.println(autoOrder);
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}