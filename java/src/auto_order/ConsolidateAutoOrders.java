package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.AutoOrder;
import com.ultracart.admin.v2.models.AutoOrderConsolidate;
import com.ultracart.admin.v2.models.AutoOrderResponse;
import common.Constants;

import java.util.Arrays;

public class ConsolidateAutoOrders {
  /**
   * consolidateAutoOrders
   * an auto order with no items, the original_order is used for shipping, billing, and payment information.
   * Once you have your empty auto order, add items to it and call updateAutoOrder.
   */
  public static void execute() {
    System.out.println("--- " + ConsolidateAutoOrders.class.getSimpleName() + " ---");

    try {
      // Create auto order API instance using API key
      AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);

      String expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list

      int targetAutoOrderOid = 123456789; // set getAutoOrdersByQuery for retrieving auto orders where you can get their auto_order_oid.
      AutoOrderConsolidate consolidateRequest = new AutoOrderConsolidate();
      consolidateRequest.setSourceAutoOrderOids(Arrays.asList(23456789, 3456789)); // these are the autoorder_oids you wish to consolidate into the target.

      AutoOrderResponse apiResponse = autoOrderApi.consolidateAutoOrders(targetAutoOrderOid, consolidateRequest, expand);

      AutoOrder consolidatedAutoOrder = apiResponse.getAutoOrder();

      // TODO: make sure the consolidated order has all the items and history of all orders.
      System.out.println(consolidatedAutoOrder);
    } catch (Exception ex) {
      System.out.println("Error: " + ex.getMessage());
      ex.printStackTrace();
    }
  }
}