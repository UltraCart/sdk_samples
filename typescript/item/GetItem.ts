import {itemApi} from '../api';
import {customerApi} from '../api';
import {
    Item,
    ItemResponse,
    ItemReview,
    ItemReviews,
    Customer,
    CustomerResponse,
    CustomerReviewer
} from 'ultracart_rest_api_v2_typescript';
import {ItemFunctions} from './ItemFunctions'; // Assuming ItemFunctions is in a separate file

export class GetItem {
    /// <summary>
    /// Execute the item retrieval example
    /// </summary>
    public static async execute(): Promise<void> {
        try {
            const itemOid: number = await ItemFunctions.insertSampleItemAndGetOid();

            // Yes, I'm creating an item, getting that item in order to get the item id, then getting the item yet again
            // using a different method. All to illustrate GetItemByMerchantItemId
            const itemId: string | undefined = (await itemApi.getItem({merchantItemOid: itemOid}))?.item?.merchant_item_id;

            if (itemId === undefined) {
                console.error("itemId should not be undefined.  Something went wrong with sample item creation most likely.");
                return;
            }

            // the expand variable is undefined in the following call. we just need the base object this time.
            const apiResponse: ItemResponse = await itemApi.getItemByMerchantItemId({
                merchantItemId: itemId,
                expand: undefined,
                placeholders: false
            });
            const item: Item | undefined = apiResponse.item; // assuming this succeeded

            const merchantItemOid: number = item?.merchant_item_oid || 0;
            if (merchantItemOid === 0) {
                console.error("getItemByMerchantItemId failed.");
                return;
            }


            // This is the actual call for this script.
            // The real devil in the getItem calls is the expansion, making sure you return everything you need without
            // returning everything since these objects are extremely large.
            // These are the possible expansion values.
            /*
                accounting
                amember
                auto_order
                auto_order.steps
                ccbill
                channel_partner_mappings
                chargeback
                checkout
                content
                content.assignments
                content.attributes
                content.multimedia
                content.multimedia.thumbnails
                digital_delivery
                ebay
                email_notifications
                enrollment123
                gift_certificate
                google_product_search
                kit_definition
                identifiers
                instant_payment_notifications
                internal
                options
                payment_processing
                physical
                pricing
                pricing.tiers
                realtime_pricing
                related
                reporting
                restriction
                reviews
                reviews.individual_reviews
                salesforce
                shipping
                shipping.cases
                shipping.destination_markups
                shipping.destination_restrictions
                shipping.distribution_centers
                shipping.methods
                shipping.package_requirements
                tax
                third_party_email_marketing
                variations
                wishlist_member
            */
            // const expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure
            const expand = "reviews,reviews.individual_reviews";  // changed the random above to reviews to illustrate accessing product reviews.
            const apiResponse2: ItemResponse = await itemApi.getItem({
                merchantItemOid: merchantItemOid,
                expand: expand,
                placeholders: false
            });
            const itemWithReviews: Item | undefined = apiResponse2.item;

            const itemReviews: ItemReviews | undefined = itemWithReviews?.reviews;
            const individualReviews: ItemReview[] | undefined = itemReviews?.individual_reviews;

            if (individualReviews !== undefined) {

                // do whatever you wish with the reviews. iterate them, print them, etc.
                // if you need the reviewer information
                for (const individualReview of individualReviews) {
                    // if you need reviewer profile questions, such as "How often do you use this product?", access the
                    // rating names and scores. these are configurable by merchant, so we do not know what your questions may be.
                    // See Home -> Configuration -> Items -> Reviews -> Settings
                    // Or this URL: https://secure.ultracart.com/merchant/item/review/reviewSettingsLoad.do
                    const ratingName1: string | undefined = individualReview.rating_name1; // <-- this will not be the full question, but a key string.
                    const ratingScore1: number | undefined = individualReview.rating_score1;

                    // if you need the review information, access that via their customer object. Be careful. This can result
                    // in a LOT of API calls and exhaust your limit. You may wish to add 'Sleep' calls to your loop and cache
                    // these results daily or weekly.
                    if (individualReview.customer_profile_oid !== undefined) {
                        const customerResponse: CustomerResponse = await customerApi.getCustomer({
                            customerProfileOid: individualReview.customer_profile_oid,
                            expand: "reviewer"
                        });
                        const customer: Customer | undefined = customerResponse.customer;
                        const reviewer: CustomerReviewer | undefined = customer?.reviewer;
                    }
                }
            }

            console.log("The following item was retrieved via getItem():");
            console.log(itemWithReviews);

            await ItemFunctions.deleteSampleItemByOid(itemOid);
        } catch (e) {
            console.log("An ApiException occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better suited for async context
        }
    }
}