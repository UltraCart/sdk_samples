package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;

public class GetDigitalItem {
   /**
    * Digital Items are not normal items sold on site. They are digital files added to
    * a library and attached to normal items as accessories or main items.
    * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
    */
   public static void execute() {
       try {
           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(null);
           ItemApi itemApi = new ItemApi(Constants.API_KEY);
           ItemDigitalItemResponse apiResponse = itemApi.getDigitalItem(digitalItemOid);
           ItemDigitalItem digitalItem = apiResponse.getDigitalItem();

           System.out.println("The following item was retrieved via GetDigitalItem():");
           System.out.println(digitalItem);

           ItemFunctions.deleteSampleDigitalItem(digitalItemOid);

       } catch (Exception e) {
           System.err.println("An Exception occurred. Please review the following error:");
           e.printStackTrace();
           System.exit(1);
       }
   }
}