package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

// NOTE: requires rest-sdk version that ships cancelAutoOrderItemByReferenceOrderId.
// At the time this sample was written Maven Central only had 4.1.13 — a newer publish is required.
public class CancelAutoOrderItemByReferenceOrderId {
    /*
     * Cancel a single item on an auto order, identified by the reference (original) order id
     * that placed the auto order and the original item id on that order. This is useful when
     * you know the original UltraCart order id rather than the auto_order_oid.
     */
    public static void execute() {
        AutoOrderApi autoOrderApi = new AutoOrderApi(common.Constants.API_KEY);

        String referenceOrderId = "DEMO-12345678"; // the UltraCart order id that placed the auto order
        String originalItemId   = "ITEM001";       // the merchant item id on that original order
        String expand           = "items";         // see https://www.ultracart.com/api/#resource_auto_order.html for list

        try {
            AutoOrderResponse response = autoOrderApi.cancelAutoOrderItemByReferenceOrderId(
                referenceOrderId,
                originalItemId,
                expand,
                null
            );
            AutoOrder autoOrder = response.getAutoOrder();
            System.out.println(autoOrder);
        } catch (ApiException e) {
            System.err.println("Exception when calling AutoOrderApi#cancelAutoOrderItemByReferenceOrderId");
            e.printStackTrace();
        }
    }
}
