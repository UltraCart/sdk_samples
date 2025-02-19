using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    /// <summary>
    /// Sample code for inserting a product review
    /// </summary>
    public class InsertReview
    {
        public static void Execute()
        {
            try
            {
                // To insert a review, you'll need an item's OID (Object Identifier) first. So for this example, we create
                // a sample item first, then retrieve it by item id to fetch the item oid.
                
                Console.WriteLine("<pre>");
                string itemId = ItemFunctions.InsertSampleItem();
                Console.WriteLine("</pre>");
                ItemApi itemApi = Samples.GetItemApi(); // convenience function for getting an api handle.

                string expand = "reviews"; // expand string is 'reviews' because we'll need to update the sample item's review template below.
                // list of expansions for item object: https://www.ultracart.com/api/#resource_item.html

                ItemResponse itemResponse = itemApi.GetItemByMerchantItemId(itemId, expand, null);
                Item item = itemResponse.Item;
                int itemOid = item.MerchantItemOid;

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
                reviews.ReviewTemplateOid = reviewTemplateOid;
                item.Reviews = reviews;
                item = itemApi.UpdateItem(itemOid, item, expand, null).Item;

                // You will need to know what your product review looks like.
                ItemReview review = new ItemReview();
                review.Title = "Best Product Ever!";
                review.Review = "I loved this product. I bought it for my wife and she was so happy she cried. blah blah blah";
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
                review = itemApi.InsertReview(itemOid, review).Review;

                Console.WriteLine("<br>This is my review object:<br><pre>");
                Console.WriteLine(review.ToString());
                Console.WriteLine("</pre>");

                // This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
                // DeleteSampleItem(itemId);
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception occurred. Please review the following error:");
                Console.WriteLine(e.ToString()); // handle gracefully
                Environment.Exit(1);
            }
        }
    }
}