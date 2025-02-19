using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class GetItemByMerchantItemId
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
                string itemId = ItemFunctions.InsertSampleItem();

                ItemApi itemApi = new ItemApi(Constants.ApiKey);

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
                string expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure
                ItemResponse apiResponse = itemApi.GetItemByMerchantItemId(itemId, expand, false);
                Item item = apiResponse.Item;

                Console.WriteLine("The following item was retrieved via getItemByMerchantItemId():");
                Console.WriteLine(item.ToString());

                ItemFunctions.DeleteSampleItem(itemId);
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