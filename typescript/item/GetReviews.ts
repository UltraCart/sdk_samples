import { itemApi } from '../api';
import {
    ItemReviewsResponse,
    ItemReview
} from 'ultracart_rest_api_v2_typescript';

/**
 * Execute method containing all business logic
 */
export async function execute(): Promise<void> {
    /*
     * Retrieves all user reviews for an item.
     *
     * The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
     * ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid
     */

    const merchantItemOid: number = 123456;

    try {
        const apiResponse: ItemReviewsResponse = await itemApi.getReviews({merchantItemOid});

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            process.exit(1);
        }

        const reviews: ItemReview[] = apiResponse.reviews || [];

        reviews.forEach((review: ItemReview) => {
            console.log(review.toString());
        });
    } catch (error) {
        console.error("An error occurred while fetching reviews:", error);
        process.exit(1);
    }
}