import { itemApi } from '../api.js';

export class UpdateReview {
    /**
     * Updates an existing item review with new details
     *
     * Note: To update a review, you'll need:
     * 1. The merchant item's OID (Object Identifier)
     * 2. The specific review's OID you wish to update
     *
     * If you don't know the item's OID, call GetItemByMerchantItemId() to retrieve it
     */
    static async execute() {
        try {
            // Merchant item OID and review OID to update
            const merchantItemOid = 99998888; // Replace with your actual merchant item OID
            const reviewOid = 123456; // Replace with the specific review OID to update

            // Retrieve the existing review
            const reviewResponse = await new Promise((resolve, reject) => {
                itemApi.getReview(merchantItemOid, reviewOid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const review = reviewResponse.review;

            // Ensure the review exists before updating
            if (!review) {
                throw new Error('Review not found');
            }

            // Update review details
            review.title = "Best Product Ever!";
            review.review = "I loved this product. I bought it for my wife and she was so happy she cried. blah blah blah";
            review.reviewed_nickname = "Bob420";
            review.featured = true;

            // Update rating details
            review.rating_name1 = "Durability";
            review.rating_name2 = "Price";
            review.rating_name3 = "Performance";
            review.rating_name4 = "Appearance";
            review.rating_score1 = 4.5;
            review.rating_score2 = 3.5;
            review.rating_score3 = 2.5;
            review.rating_score4 = 1.5;
            review.overall = 5.0;

            // Additional review metadata
            review.reviewer_location = "Southside Chicago";
            review.status = "Approved";

            // Update the review and retrieve the updated version
            const updatedReviewResponse = await new Promise((resolve, reject) => {
                itemApi.updateReview(
                    reviewOid,
                    merchantItemOid,
                    review
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
            const updatedReview = updatedReviewResponse.review;

            // Log the updated review details
            console.log("Updated Review Object:");
            console.log(JSON.stringify(updatedReview, null, 2));
        } catch (error) {
            console.error("An error occurred while updating the review:", error);
            process.exit(1);
        }
    }
}