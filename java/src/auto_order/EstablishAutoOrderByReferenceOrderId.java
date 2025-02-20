package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.AutoOrder;
import com.ultracart.admin.v2.models.AutoOrderItem;
import com.ultracart.admin.v2.models.AutoOrderResponse;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class EstablishAutoOrderByReferenceOrderId {
    /**
     *
     * This method takes a normal order id and creates an empty auto order from it.  While this might seem useless having
     * an auto order with no items, the original_order is used for shipping, billing, and payment information.
     * Once you have your empty auto order, add items to it and call updateAutoOrder.
     *
     */
    public static void execute() {
        System.out.println("--- " + EstablishAutoOrderByReferenceOrderId.class.getSimpleName() + " ---");

        try {
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);

            String expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list

            String originalOrderId = "DEMO-123457";
            AutoOrderResponse apiResponse = autoOrderApi.establishAutoOrderByReferenceOrderId(originalOrderId, expand);

            AutoOrder emptyAutoOrder = apiResponse.getAutoOrder();
            int autoOrderOid = emptyAutoOrder.getAutoOrderOid();

            List<AutoOrderItem> items = new ArrayList<>();
            AutoOrderItem item = new AutoOrderItem();
            item.setOriginalItemId("ITEM_ABC"); // This item should be configured with auto order features.
            item.setOriginalQuantity(BigDecimal.valueOf(1));
            item.setArbitraryUnitCost(BigDecimal.valueOf(59.99));
            // Valid Frequencies
            // "Weekly", "Biweekly", "Every...", "Every 10 Days", "Every 4 Weeks", "Every 6 Weeks", "Every 8 Weeks", "Every 24 Days", "Every 28 Days", "Monthly",
            // "Every 45 Days", "Every 2 Months", "Every 3 Months", "Every 4 Months", "Every 5 Months", "Every 6 Months", "Yearly"
            item.setFrequency(AutoOrderItem.FrequencyEnum.MONTHLY);
            items.add(item);
            emptyAutoOrder.setItems(items);

            String validateOriginalOrder = "No";
            AutoOrderResponse updateResponse = autoOrderApi.updateAutoOrder(autoOrderOid, emptyAutoOrder, validateOriginalOrder, expand);
            AutoOrder updatedAutoOrder = updateResponse.getAutoOrder();
            System.out.println(updatedAutoOrder);
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}