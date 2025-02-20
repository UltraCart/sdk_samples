package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.AutoOrder;
import com.ultracart.admin.v2.models.AutoOrderQuery;
import com.ultracart.admin.v2.models.AutoOrdersResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetAutoOrdersByQuery {
  /**
   * This example illustrates how to retrieve auto orders and handle pagination.
   * <p>
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
    System.out.println("--- " + GetAutoOrdersByQuery.class.getSimpleName() + " ---");

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

        List<AutoOrder> chunkOfOrders = getAutoOrderChunk(autoOrderApi, offset, limit);
        autoOrders.addAll(chunkOfOrders);
        offset = offset + limit;
        moreRecordsToFetch = chunkOfOrders.size() == limit;
        iteration++;
      }

      // Display auto orders
      for (AutoOrder autoOrder : autoOrders) {
        System.out.println(autoOrder);
      }

      System.out.println("Retrieved " + autoOrders.size() + " auto orders");
    } catch (Exception ex) {
      System.out.println("ApiException occurred on iteration");
      System.out.println(ex);
      System.exit(1);
    }
  }

  /**
   * Returns a chunk of auto orders based on query parameters
   *
   * @param autoOrderApi The auto order API instance
   * @param offset       Pagination offset
   * @param limit        Maximum number of records to return
   * @return List of matching auto orders
   */
  public static List<AutoOrder> getAutoOrderChunk(AutoOrderApi autoOrderApi, int offset, int limit) throws ApiException {
    String expand =
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

    String sort = "next_shipment_dts";
    AutoOrderQuery query = new AutoOrderQuery();
    query.setEmail("support@ultracart.com");
    AutoOrdersResponse apiResponse = autoOrderApi.getAutoOrdersByQuery(query, limit, offset, sort, expand);

    if (apiResponse.getAutoOrders() != null) {
      return apiResponse.getAutoOrders();
    }

    return new ArrayList<AutoOrder>();
  }
}