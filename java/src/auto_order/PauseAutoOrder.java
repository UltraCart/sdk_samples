package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class PauseAutoOrder {
    /*
     * This is a convenience method created for an UltraCart merchant to pause a large number of auto orders
     * due to an inventory shortage. This is not new functionality and can be accomplished with the normal updateAutoOrder
     * call. It does the following logic to an auto order:
     * for each item in the auto order:
     *    if the item is not paused, pause it, setPause(true)
     * save the changes by calling updateAutoOrder()
     *
     * Some warnings if you choose to use this method.
     * There are no convenience methods to unpause auto orders.
     * There are no convenience methods to query which auto orders are paused.
     * We do not recommend pausing auto orders and the merchant is on their own to manage auto order state if they
     * choose to begin pausing orders. Keep good track of what you're doing.
     *
     */
    public static void execute() {
        AutoOrderApi autoOrderApi = new AutoOrderApi(common.Constants.API_KEY);

        String expand = "items"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
        int autoOrderOid = 123456789; // get an auto order and update it. There are many ways to retrieve an auto order.
        try {
            AutoOrderResponse getResponse = autoOrderApi.getAutoOrder(autoOrderOid, expand);
            AutoOrder autoOrder = getResponse.getAutoOrder();

            AutoOrderResponse pauseResponse = autoOrderApi.pauseAutoOrder(autoOrderOid, autoOrder, expand);
            AutoOrder pausedAutoOrder = pauseResponse.getAutoOrder();
            System.out.println(pausedAutoOrder);
        } catch (ApiException e) {
            System.err.println("Exception when calling AutoOrderApi#getAutoOrder");
            e.printStackTrace();
        }
    }
}