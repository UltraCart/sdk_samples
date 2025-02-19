using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.item
{
    public class DeleteReview
    {
        /*
            Deletes a specific user review for an item. This would most likely be used by a merchant who has cached all
            reviews on a separate site and then wishes to remove a particular review.

            The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
            ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid

            The review_oid is a unique identifier used by UltraCart. If you do not know a review's oid, call
            ItemApi.GetReviews() to get all reviews where you can then grab the oid from an item.

            Success returns back a status code of 204 (No Content)
         */
        public static void Execute()
        {
            ItemApi itemApi = new ItemApi(Constants.ApiKey);
            int merchantItemOid = 123456;
            int reviewOid = 987654;
            itemApi.DeleteReview(reviewOid, merchantItemOid);
        }
    }
}