package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;
import java.util.List;
import java.util.UUID;

public class GetDigitalItemsByExternalId {
   public static void execute() {
       try {
           /*
            * Please Note!
            * Digital Items are not normal items you sell on your site. They are digital files that you may add to
            * a library and then attach to a normal item as an accessory or the main item itself.
            * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
            */

           String externalId = UUID.randomUUID().toString().replace("-", "");
           System.out.println("My external id is " + externalId);
           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(externalId);
           ItemApi itemApi = new ItemApi(Constants.API_KEY);
           ItemDigitalItemsResponse apiResponse = itemApi.getDigitalItemsByExternalId(externalId);
           List<ItemDigitalItem> digitalItems = apiResponse.getDigitalItems();

           System.out.println("The following item was retrieved via GetDigitalItem():");
           System.out.println(digitalItems);

           ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
       } catch (Exception e) {
           System.out.println("An Exception occurred. Please review the following error:");
           e.printStackTrace();
           System.exit(1);
       }
   }
}