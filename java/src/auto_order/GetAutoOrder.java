package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;

public class GetAutoOrder {
    /**
     * retrieves an auto_order given the auto_order_oid;
     */
    public static void execute() {
        System.out.println("--- " + GetAutoOrder.class.getSimpleName() + " ---");
        
        try {
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);
            
            String expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
            int autoOrderOid = 123456789; // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
            
            AutoOrderResponse apiResponse = autoOrderApi.getAutoOrder(autoOrderOid, expand);
            AutoOrder autoOrder = apiResponse.getAutoOrder();
            
            System.out.println(autoOrder);
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}