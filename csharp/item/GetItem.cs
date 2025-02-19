using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class GetItem
    {

        /// <summary>
        /// Execute the item retrieval example
        /// </summary>
        public static void Execute()
        {
            // Of the two getItem methods, you'll probably always use getItemByMerchantItemId instead of this one.
            // Most item work is done with the item id, not the item oid. The latter is only meaningful as a primary
            // key in the UltraCart databases. But here is an example of using getItem(). We take the long route here
            // of retrieving the item using getItemByMerchantItemId to obtain the oid rather than hard-coding it. We do this
            // because these samples are used in our quality control system and run repeatedly.

            try
            {
                
                ItemApi itemApi = new ItemApi(Constants.ApiKey);
                int itemOid = ItemFunctions.InsertSampleItemAndGetOid();
                CustomerApi customerApi = new CustomerApi(Constants.ApiKey); // only needed for accessing reviewer information below.

                // Yes, I'm creating an item, getting that item in order to get the item id, then getting the item yet again
                // using a different method. All to illustrate GetItemByMerchantItemId
                string itemId = itemApi.GetItem(itemOid).Item.MerchantItemId;
                
                
                // the expand variable is null in the following call. we just need the base object this time.
                ItemResponse apiResponse = itemApi.GetItemByMerchantItemId(itemId, null, false);
                Item item = apiResponse.Item; // assuming this succeeded

                int merchantItemOid = item.MerchantItemOid;

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
                // string expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure
                string expand = "reviews,reviews.individual_reviews";  // changed the random above to reviews to illustrate accessing product reviews.
                apiResponse = itemApi.GetItem(merchantItemOid, expand, false);
                item = apiResponse.Item;

                ItemReviews itemReviews = item.Reviews;
                List<ItemReview> individualReviews = itemReviews.IndividualReviews;
                
                // do whatever you wish with the reviews. iterate them, print them, etc.
                // if you need the reviewer information
                foreach (ItemReview individualReview in individualReviews)
                {
                    // if you need reviewer profile questions, such as "How often do you use this product?", access the
                    // rating names and scores. these are configurable by merchant, so we do not know what your questions may be.
                    // See Home -> Configuration -> Items -> Reviews -> Settings
                    // Or this URL: https://secure.ultracart.com/merchant/item/review/reviewSettingsLoad.do
                    string ratingName1 = individualReview.RatingName1; // <-- this will not be the full question, but a key string.
                    decimal ratingScore1 = individualReview.RatingScore1;

                    // if you need the review information, access that via their customer object. Be careful. This can result
                    // in a LOT of API calls and exhaust your limit. You may wish to add 'Sleep' calls to your loop and cache
                    // these results daily or weekly.
                    CustomerResponse customerResponse = customerApi.GetCustomer(individualReview.CustomerProfileOid, "reviewer");
                    Customer customer = customerResponse.Customer;
                    CustomerReviewer reviewer = customer.Reviewer;
                }

                Console.WriteLine("The following item was retrieved via getItem():");
                Console.WriteLine(item.ToString());

                ItemFunctions.DeleteSampleItemByOid(itemOid);
            }
            catch (com.ultracart.admin.v2.Client.ApiException e)
            {
                Console.WriteLine("An ApiException occurred. Please review the following error:");
                Console.WriteLine(e.ToString()); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}