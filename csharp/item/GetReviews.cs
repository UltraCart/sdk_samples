using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using System.Collections.Generic;

namespace SdkSample.item
{
    public class GetReviews
    {
        /// <summary>
        /// Execute method containing all business logic
        /// </summary>
        public static void Execute()
        {
            /*
             * Retrieves all user reviews for an item.
             *
             * The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
             * ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid
             */

            ItemApi itemApi = new ItemApi(Constants.ApiKey);
            int merchantItemOid = 123456;
            ItemReviewsResponse apiResponse = itemApi.GetReviews(merchantItemOid);

            if (apiResponse.Error != null)
            {
                Console.Error.WriteLine(apiResponse.Error.DeveloperMessage);
                Console.Error.WriteLine(apiResponse.Error.UserMessage);
                Environment.Exit(1);
            }

            List<ItemReview> reviews = apiResponse.Reviews;
            
            foreach (ItemReview review in reviews)
            {
                Console.WriteLine(review.ToString());
            }
        }
    }
}