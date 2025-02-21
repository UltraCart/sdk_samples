package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import common.Constants;
import java.math.BigDecimal;

/// <summary>
/// Sample code for inserting a product review
/// </summary>
public class InsertReview {
   public static void execute() {
       try {
           // To insert a review, you'll need an item's OID (Object Identifier) first. So for this example, we create
           // a sample item first, then retrieve it by item id to fetch the item oid.

           System.out.println("<pre>");
           String itemId = ItemFunctions.insertSampleItem();
           System.out.println("</pre>");
           ItemApi itemApi = new ItemApi(Constants.API_KEY);

           String expand = "reviews"; // expand string is 'reviews' because we'll need to update the sample item's review template below.
           // list of expansions for item object: https://www.ultracart.com/api/#resource_item.html

           ItemResponse itemResponse = itemApi.getItemByMerchantItemId(itemId, expand, null);
           Item item = itemResponse.getItem();
           int itemOid = item.getMerchantItemOid();

           // The target item must have a review template associated before you may attach a review.
           // You may create a review template here:
           // https://secure.ultracart.com/merchant/item/review/reviewTemplateListLoad.do
           // We're using a review template from our development system and it will not work for you.
           // Once you have a review template, update your item either via our gui or the rest api.
           // GUI: secure.ultracart.com -> Home -> Items -> <your item> -> Edit -> Review tab
           // Since we're using a sample item we just created above (line 17), we'll update via the rest api.
           // The rest api requires the review template oid, which is found on the template screen (url on line 25 above)

           int reviewTemplateOid = 402;
           ItemReviews reviews = new ItemReviews();
           reviews.setReviewTemplateOid(reviewTemplateOid);
           item.setReviews(reviews);
           item = itemApi.updateItem(itemOid, item, expand, null).getItem();

           // You will need to know what your product review looks like.
           ItemReview review = new ItemReview();
           review.setTitle("Best Product Ever!");
           review.setReview("I loved this product. I bought it for my wife and she was so happy she cried. blah blah blah");
           review.setReviewedNickname("Bob420");
           review.setFeatured(true); // featured? sure. why not? this is a great review.
           review.setRatingName1("Durability");
           review.setRatingName2("Price");
           review.setRatingName3("Performance");
           review.setRatingName4("Appearance");
           review.setRatingScore1(new BigDecimal("4.5"));
           review.setRatingScore2(new BigDecimal("3.5"));
           review.setRatingScore3(new BigDecimal("2.5"));
           review.setRatingScore4(new BigDecimal("1.5"));
           review.setOverall(new BigDecimal("5.0")); // hooray!
           review.setReviewerLocation("Southside Chicago");
           review.setStatus(ItemReview.StatusEnum.APPROVED);
           // insert the review and update our local variable to see how the review looks now.
           review = itemApi.insertReview(itemOid, review).getReview();

           System.out.println("<br>This is my review object:<br><pre>");
           System.out.println(review.toString());
           System.out.println("</pre>");

           // This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
           // ItemFunctions.deleteSampleItem(itemId);
       }
       catch (Exception e) {
           System.out.println("An Exception occurred. Please review the following error:");
           System.out.println(e.toString()); // handle gracefully
           System.exit(1);
       }
   }
}