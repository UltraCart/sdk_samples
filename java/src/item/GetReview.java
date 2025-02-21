package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class GetReview {
   /// <summary>
   /// Execute method containing all business logic
   /// </summary>
   public static void execute() throws ApiException {
       /*
        * Retrieves a specific user review for an item. This would most likely be used by a merchant who has cached all
        * reviews on a separate site and then wishes to update a particular review. It's always best to "get" the object,
        * make changes to it, then call the update instead of trying to recreate the object from scratch.
        *
        * The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
        * ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid
        *
        * The review_oid is a unique identifier used by UltraCart. If you do not know a review's oid, call
        * ItemApi.GetReviews() to get all reviews where you can then grab the oid from an item.
        */

       ItemApi itemApi = new ItemApi(Constants.API_KEY);
       int merchantItemOid = 123456;
       int reviewOid = 987654;
       ItemReviewResponse apiResponse = itemApi.getReview(reviewOid, merchantItemOid);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       ItemReview review = apiResponse.getReview();

       System.out.println("<html lang=\"en\"><body><pre>");
       System.out.println(review.toString());
       System.out.println("</pre></body></html>");
   }
}