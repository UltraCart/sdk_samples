import { itemApi } from '../api';
import {
    ItemReviewResponse,
    ItemReview
} from 'ultracart_rest_api_v2_typescript';

/**
 * Execute method containing all business logic
 */
export async function execute(): Promise<void> {
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

    const merchantItemOid: number = 123456;
    const reviewOid: number = 987654;

    try {
        const apiResponse: ItemReviewResponse = await itemApi.getReview({reviewOid, merchantItemOid});

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            process.exit(1);
        }

        const review: ItemReview | undefined = apiResponse.review;

        console.log(review?.toString());
    } catch (error) {
        console.error("An error occurred while fetching the review:", error);
        process.exit(1);
    }
}