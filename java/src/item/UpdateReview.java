package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.ItemReview;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;

public class UpdateReview {
   public static void execute() {
       try {
           // To update a review, you'll need an item's OID (Object Identifier) and the review oid first.

           int merchantItemOid = 99998888; // if you don't know your oid, call GetItemByMerchantItemId() to get your item, then get the oid.
           int reviewOid = 123456; // this is the particular oid you wish to update.

           ItemApi itemApi = new ItemApi(Constants.API_KEY); // convenience function for getting an api handle.
           ItemReview review = itemApi.getReview(merchantItemOid, reviewOid).getReview();

           // You will need to know what your product review looks like.
           review.setTitle("Best Product Ever!");
           review.setReview("I loved this product.  I bought it for my wife and she was so happy she cried.  blah blah blah");
           review.setReviewedNickname("Bob420");
           review.setFeatured(true); // featured? sure. why not? this is a great review.
           review.setRatingName1("Durability");
           review.setRatingName2("Price");
           review.setRatingName3("Performance");
           review.setRatingName4("Appearance");
           review.setRatingScore1(BigDecimal.valueOf(4.5));
           review.setRatingScore2(BigDecimal.valueOf(3.5));
           review.setRatingScore3(BigDecimal.valueOf(2.5));
           review.setRatingScore4(BigDecimal.valueOf(1.5));
           review.setOverall(BigDecimal.valueOf(5.0)); // hooray!
           review.setReviewerLocation("Southside Chicago");
           review.setStatus(ItemReview.StatusEnum.APPROVED);
           // insert the review and update our local variable to see how the review looks now.
           review = itemApi.updateReview(reviewOid, merchantItemOid, review).getReview();

           System.out.println("This is my review object:");
           System.out.println(review);

           // This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
           // DeleteSampleItem(itemId);
       }
       catch (ApiException e) {
           System.out.println("An ApiException occurred.  Please review the following error:");
           System.out.println(e); // <-- change_me: handle gracefully
           System.exit(1);
       }
   }
}