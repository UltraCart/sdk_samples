import {itemApi} from '../api.js';
import {ItemFunctions} from './itemFunctions.js';

/**
 * Sample code for inserting a product review
 */
export async function execute() {
    try {
        // To insert a review, you'll need an item's OID (Object Identifier) first. So for this example, we create
        // a sample item first, then retrieve it by item id to fetch the item oid.

        const itemId = await ItemFunctions.insertSampleItem();

        const expand = "reviews"; // expand string is 'reviews' because we'll need to update the sample item's review template below.
        // list of expansions for item object: https://www.ultracart.com/api/#resource_item.html

        const itemResponse = await new Promise((resolve, reject) => {
            itemApi.getItemByMerchantItemId(itemId, {_expand: expand}, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        const item = itemResponse.item;

        if (!item) {
            throw new Error("Unable to retrieve item");
        }

        const itemOid = item.merchant_item_oid || 0; // TODO: In a real script, add logic for undefined.

        // The target item must have a review template associated before you may attach a review.
        // You may create a review template here:
        // https://secure.ultracart.com/merchant/item/review/reviewTemplateListLoad.do
        // We're using a review template from our development system and it will not work for you.
        // Once you have a review template, update your item either via our gui or the rest api.
        // GUI: secure.ultracart.com -> Home -> Items -> <your item> -> Edit -> Review tab
        // Since we're using a sample item we just created above (line 17), we'll update via the rest api.
        // The rest api requires the review template oid, which is found on the template screen (url on line 25 above)

        const reviewTemplateOid = 402;
        const reviews = {review_template_oid: reviewTemplateOid};
        item.reviews = reviews;

        const updatedItemResponse = await new Promise((resolve, reject) => {
            itemApi.updateItem(
                itemOid,
                item,
                {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
        });

        const updatedItemMaybe = updatedItemResponse.item;

        // You will need to know what your product review looks like.
        const review = {
            title: "Best Product Ever!",
            review: "I loved this product. I bought it for my wife and she was so happy she cried. blah blah blah",
            reviewed_nickname: "Bob420",
            featured: true, // featured? sure. why not? this is a great review.
            rating_name1: "Durability",
            rating_name2: "Price",
            rating_name3: "Performance",
            rating_name4: "Appearance",
            rating_score1: 4.5,
            rating_score2: 3.5,
            rating_score3: 2.5,
            rating_score4: 1.5,
            overall: 5.0, // hooray!
            reviewer_location: "Southside Chicago",
            status: "Approved"
        };

        // insert the review and update our local variable to see how the review looks now.
        const insertedReviewResponse = await new Promise((resolve, reject) => {
            itemApi.insertReview(itemOid, review, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        const insertedReview = insertedReviewResponse.review;

        console.log("This is my review object:");
        console.log(insertedReview?.toString());

        // This will clean up the sample item, but you may wish to review the item in the backend or on your website first.
        // await ItemFunctions.deleteSampleItem(itemId);
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // handle gracefully
        process.exit(1);
    }
}