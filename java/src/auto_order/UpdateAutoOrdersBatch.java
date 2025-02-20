package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.AutoOrder;
import com.ultracart.admin.v2.models.AutoOrdersRequest;
import com.ultracart.admin.v2.models.AutoOrdersResponse;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class UpdateAutoOrdersBatch {
    /**
     *
     * This method allows for updating multiple auto orders.
     * Warning: Take great care editing auto orders.  They are complex.
     * Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
     * to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
     * make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.
     *
     */
    public static void execute() {
        System.out.println("--- " + UpdateAutoOrdersBatch.class.getSimpleName() + " ---");
        
        try {
            // Create auto order API instance using API key
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.API_KEY);
            
            // The _async parameter is what it seems.  True if async.
            // The max records allowed depends on the async flag.  Synch max is 20, Asynch max is 100.
            
            boolean async = true; // if true, success returns back a 204 No Content. False returns back the updated orders.
            String expand = null; // since we're async, nothing is returned, so we don't care about expansions.
            // If you are doing a synchronous operation, then set your expand appropriately. set getAutoOrders()
            // sample for expansion samples.
            boolean placeholders = false; // mostly used for UI, not needed for a pure scripting operation.
            
            List<AutoOrder> autoOrders = new ArrayList<AutoOrder>(); // TODO: This should be a list of auto orders that have been updated. See any getAutoOrders method for retrieval.
            AutoOrdersRequest autoOrdersRequest = new AutoOrdersRequest();
            autoOrdersRequest.setAutoOrders(autoOrders);
            
            AutoOrdersResponse apiResponse = autoOrderApi.updateAutoOrdersBatch(autoOrdersRequest, expand, placeholders, async);
            if (apiResponse != null) {
                // something went wrong if we have a response.
                System.out.println(apiResponse);
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}