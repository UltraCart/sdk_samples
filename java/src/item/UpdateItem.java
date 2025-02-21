package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.Item;
import com.ultracart.admin.v2.models.ItemPricing;
import com.ultracart.admin.v2.models.ItemResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;

public class UpdateItem {
   public static void execute() {
       try {
           String itemId = ItemFunctions.insertSampleItem();

           ItemApi itemApi = new ItemApi(Constants.API_KEY);

           // See one of the getItem or getItems samples for possible expansion values
           // See also: https://www.ultracart.com/api/#resource_item.html
           String expand = "pricing";
           ItemResponse apiResponse = itemApi.getItemByMerchantItemId(itemId, expand, false);
           Item item = apiResponse.getItem();
           BigDecimal originalPrice = item.getPricing().getCost();

           // update the price of the item.
           ItemPricing itemPricing = item.getPricing();
           itemPricing.setCost(BigDecimal.valueOf(12.99));

           apiResponse = itemApi.updateItem(item.getMerchantItemOid(), item, expand, false);
           Item updatedItem = apiResponse.getItem();

           // ensure the price was updated.
           System.out.println("Original Price: " + originalPrice);
           System.out.println("Updated Price: " + updatedItem.getPricing().getCost());

           ItemFunctions.deleteSampleItem(itemId);
       }
       catch (ApiException e) {
           System.out.println("An ApiException occurred.  Please review the following error:");
           System.out.println(e); // <-- change_me: handle gracefully
           System.exit(1);
       }
   }
}