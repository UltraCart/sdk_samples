package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;
import java.util.List;

public class GetDigitalItems {
   public static void execute() {
       try {
           /*
            * Please Note!
            * Digital Items are not normal items you sell on your site. They are digital files that you may add to
            * a library and then attach to a normal item as an accessory or the main item itself.
            * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
            */

           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(null);
           ItemApi itemApi = new ItemApi(Constants.API_KEY);

           int limit = 100;
           int offset = 0;
           String since = null; // digital items do not use since. leave as null.
           String sort = null; // if null, use default of original_filename
           String expand = null; // digital items have no expansion. leave as null. this value is ignored
           Boolean placeholders = null; // digital items have no placeholders. leave as null.

           ItemDigitalItemsResponse apiResponse = itemApi.getDigitalItems(limit, offset, since, sort, expand, placeholders);
           List<ItemDigitalItem> digitalItems = apiResponse.getDigitalItems();

           System.out.println("The following items were retrieved via GetDigitalItems():");
           for (ItemDigitalItem digitalItem : digitalItems) {
               System.out.println(digitalItem);
           }
       } catch (Exception e) {
           System.out.println("An Exception occurred. Please review the following error:");
           e.printStackTrace();
           System.exit(1);
       }
   }
}