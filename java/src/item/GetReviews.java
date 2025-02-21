package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;
import java.util.List;

public class GetReviews {
   /// <summary>
   /// Execute method containing all business logic
   /// </summary>
   public static void execute() throws ApiException {
       /*
        * Retrieves all user reviews for an item.
        *
        * The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
        * ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid
        */

       ItemApi itemApi = new ItemApi(Constants.API_KEY);
       int merchantItemOid = 123456;
       ItemReviewsResponse apiResponse = itemApi.getReviews(merchantItemOid);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       List<ItemReview> reviews = apiResponse.getReviews();

       for (ItemReview review : reviews) {
           System.out.println(review.toString());
       }
   }
}