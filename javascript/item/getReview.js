import { itemApi } from '../api.js';

/**
 * Execute method containing all business logic
 */
export async function execute() {
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

    const merchantItemOid = 123456;
    const reviewOid = 987654;

    try {
        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.getReview(reviewOid, merchantItemOid, function (error, data, response) {
                if (error) reject(error);
                else resolve(data, response);
            });
        });

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            process.exit(1);
        }

        const review = apiResponse.review;

        console.log(review ? review.toString() : undefined); // Handle toString() in JS
    } catch (error) {
        console.error("An error occurred while fetching the review:", error);
        process.exit(1);
    }
}