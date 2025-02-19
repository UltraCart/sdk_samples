using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class GetReview
    {
        /// <summary>
        /// Execute method containing all business logic
        /// </summary>
        public static void Execute()
        {
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

            ItemApi itemApi = new ItemApi(Constants.ApiKey);
            int merchantItemOid = 123456;
            int reviewOid = 987654;
            ItemReviewResponse apiResponse = itemApi.GetReview(reviewOid, merchantItemOid);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            ItemReview review = apiResponse.Review;
            
            Console.WriteLine("<html lang=\"en\"><body><pre>");
            Console.WriteLine(review.ToString());
            Console.WriteLine("</pre></body></html>");
        }
    }
}