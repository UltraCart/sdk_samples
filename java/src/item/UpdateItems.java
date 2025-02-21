package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.Item;
import com.ultracart.admin.v2.models.ItemResponse;
import com.ultracart.admin.v2.models.ItemsRequest;
import com.ultracart.admin.v2.models.ItemsResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.Arrays;

public class UpdateItems {
   public static void execute() {
       try {
           String itemId1 = ItemFunctions.insertSampleItem();
           String itemId2 = ItemFunctions.insertSampleItem();

           ItemApi itemApi = new ItemApi(Constants.API_KEY);

           // See one of the getItem or getItems samples for possible expansion values 
           // See also: https://www.ultracart.com/api/#resource_item.html
           String expand = "pricing";
           ItemResponse apiResponse = itemApi.getItemByMerchantItemId(itemId1, expand, false);
           Item item1 = apiResponse.getItem();
           apiResponse = itemApi.getItemByMerchantItemId(itemId2, expand, false);
           Item item2 = apiResponse.getItem();

           // update the price of the item.
           item1.getPricing().setCost(BigDecimal.valueOf(12.99));
           item2.getPricing().setCost(BigDecimal.valueOf(14.99));

           ItemsRequest updateItemsRequest = new ItemsRequest();
           updateItemsRequest.setItems(Arrays.asList(item1, item2));
           ItemsResponse updateItemsResponse = itemApi.updateItems(updateItemsRequest, expand, false, false);

           ItemFunctions.deleteSampleItem(itemId1);
           ItemFunctions.deleteSampleItem(itemId2);
       }
       catch (ApiException e) {
           System.out.println("An ApiException occurred.  Please review the following error:");
           System.out.println(e); // <-- change_me: handle gracefully
           System.exit(1);
       }
   }
}