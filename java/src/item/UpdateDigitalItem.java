package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.ItemDigitalItem;
import com.ultracart.admin.v2.models.ItemDigitalItemResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class UpdateDigitalItem {
   public static void execute() {
       try {
           int digitalItemOid = ItemFunctions.insertSampleDigitalItem(null);

           ItemApi itemApi = new ItemApi(Constants.API_KEY);
           ItemDigitalItemResponse apiResponse = itemApi.getDigitalItem(digitalItemOid);
           ItemDigitalItem digitalItem = apiResponse.getDigitalItem();

           digitalItem.setDescription("I have updated the description to this sentence.");
           digitalItem.setClickWrapAgreement("You hereby agree that the earth is round.  No debate.");

           itemApi.updateDigitalItem(digitalItemOid, digitalItem);

           ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
       }
       catch (ApiException e) {
           System.out.println("An ApiException occurred.  Please review the following error:");
           System.out.println(e); // <-- change_me: handle gracefully
           System.exit(1);
       }
   }
}