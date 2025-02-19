using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using System;
using com.ultracart.admin.v2.Client;

namespace SdkSample.item
{
    public class UpdateReview
    {
        public static void Execute()
        {
            try
            {
                // To update a review, you'll need an item's OID (Object Identifier) and the review oid first.

                int merchantItemOid = 99998888; // if you don't know your oid, call GetItemByMerchantItemId() to get your item, then get the oid.
                int reviewOid = 123456; // this is the particular oid you wish to update.

                ItemApi itemApi = new ItemApi(Constants.ApiKey); // convenience function for getting an api handle.
                ItemReview review = itemApi.GetReview(merchantItemOid, reviewOid).Review;

                // You will need to know what your product review looks like.
                review.Title = "Best Product Ever!";
                review.Review = "I loved this product.  I bought it for my wife and she was so happy she cried.  blah blah blah";
                review.ReviewedNickname = "Bob420";
                review.Featured = true; // featured? sure. why not? this is a great review.
                review.RatingName1 = "Durability";
                review.RatingName2 = "Price";
                review.RatingName3 = "Performance";
                review.RatingName4 = "Appearance";
                review.RatingScore1 = 4.5m;
                review.RatingScore2 = 3.5m;
                review.RatingScore3 = 2.5m;
                review.RatingScore4 = 1.5m;
                review.Overall = 5.0m; // hooray!
                review.ReviewerLocation = "Southside Chicago";
                review.Status = ItemReview.StatusEnum.Approved;
                // insert the review and update our local variable to see how the review looks now.
                review = itemApi.UpdateReview(reviewOid, merchantItemOid, review).Review;

                Console.WriteLine("This is my review object:");
                Console.WriteLine(review);

                // This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
                // DeleteSampleItem(itemId);
            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}