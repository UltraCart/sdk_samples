import { itemApi } from '../api.js';

/**
 * Execute method containing all business logic
 */
export async function execute() {
    /*
     * Retrieves all user reviews for an item.
     *
     * The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
     * ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid
     */

    const merchantItemOid = 123456;

    try {
        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.getReviews(merchantItemOid, function (error, data, response) {
                if (error) reject(error);
                else resolve(data, response);
            });
        });

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            process.exit(1);
        }

        const reviews = apiResponse.reviews || [];

        reviews.forEach((review) => {
            console.log(review ? review.toString() : undefined); // Handle toString() in JS
        });
    } catch (error) {
        console.error("An error occurred while fetching reviews:", error);
        process.exit(1);
    }
}