package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;

public class UpdateAutoOrder {
    /**
     *
     * This method allows for updating an auto order.
     * Warning: Take great care editing auto orders.  They are complex.
     * Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
     * to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
     * make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.
     *
     */
    public static void execute() {
        System.out.println("--- " + UpdateAutoOrder.class.getSimpleName() + " ---");
        
        try {
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);
            
            String expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
            int autoOrderOid = 123456789; // get an auto order and update it. There are many ways to retrieve an auto order.
            AutoOrderResponse apiResponse = autoOrderApi.getAutoOrder(autoOrderOid, null);
            AutoOrder autoOrder = apiResponse.getAutoOrder();
            String validateOriginalOrder = "No";
            
            // for this example, the customer supplied the wrong postal code when ordering. So to change the postal code for
            // all subsequent auto orders, we change the original order.
            autoOrder.getOriginalOrder().getBilling().setPostalCode("44233");
            
            AutoOrderResponse updateResponse = autoOrderApi.updateAutoOrder(autoOrderOid, autoOrder, validateOriginalOrder, expand);
            AutoOrder updatedAutoOrder = updateResponse.getAutoOrder();
            System.out.println(updatedAutoOrder);
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}