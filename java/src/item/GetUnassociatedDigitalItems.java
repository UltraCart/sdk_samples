package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;
import java.util.List;

public class GetUnassociatedDigitalItems {
   /// <summary>
   /// Execute method containing all business logic
   /// </summary>
   public static void execute() {
       try {
           /*
            * Please Note!
            * Digital Items are not normal items you sell on your site. They are digital files that you may add to
            * a library and then attach to a normal item as an accessory or the main item itself.
            * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
            *
            * Retrieves a group of digital items (file information) from the account that are not yet associated with any
            * actual items. If no parameters are specified, all digital items will be returned. Be aware that these are
            * not normal items that can be added to a shopping cart. Rather, they are digital files that may be associated
            * with normal items. You will need to make multiple API calls in order to retrieve the entire result set since
            * this API performs result set pagination.
            *
            * Default sort order: original_filename
            * Possible sort orders: original_filename, description, file_size
            */

           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(null); // create an item that will be unassociated.
           ItemApi itemApi = new ItemApi(Constants.API_KEY);

           int limit = 100;
           int offset = 0;
           String since = null; // digital items do not use since. leave as null.
           String sort = null; // if null, use default of original_filename
           String expand = null; // digital items have no expansion. leave as null. this value is ignored
           Boolean placeholders = null; // digital items have no placeholders. leave as null.

           ItemDigitalItemsResponse apiResponse = itemApi.getUnassociatedDigitalItems(limit, offset, since, sort, expand, placeholders);
           List<ItemDigitalItem> digitalItems = apiResponse.getDigitalItems(); // assuming this succeeded

           System.out.println("The following items were retrieved via GetUnassociatedDigitalItems():");
           for (ItemDigitalItem digitalItem : digitalItems) {
               System.out.println(digitalItem.toString());
           }
       }
       catch (Exception e) {
           System.out.println("An Exception occurred. Please review the following error:");
           System.out.println(e.toString()); // <-- change_me: handle gracefully
           System.exit(1);
       }
   }
}