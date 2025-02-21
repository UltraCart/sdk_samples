package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class DeleteReview {
   /**
    * Deletes a specific user review for an item. Used by merchants who cache reviews
    * on a separate site and wish to remove a particular review.
    *
    */
   public static void execute() throws ApiException {
       ItemApi itemApi = new ItemApi(Constants.API_KEY);
       int merchantItemOid = 123456;
       int reviewOid = 987654;
       itemApi.deleteReview(reviewOid, merchantItemOid);
   }
}