using System;
using System.Collections.Generic;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class GetItems
    {
        /// <summary>
        /// Execute the item retrieval example
        /// </summary>
        public static void Execute()
        {
            /*
             * This example illustrates how to retrieve items. When dealing with items, please note that categories are
             * essentially folders to organize and store items. They are only used for that purpose and play no role in
             * the checkout process or in the storefront display of items. So you may organize your items as best serves
             * you. We're often asked why was use the word 'category' instead of 'folder'. We started down the road of
             * item management 27 years ago with the word 'category', and it's too much trouble to change. So items are
             * managed by categories, not folders. But they are folders. :)
             * The call takes two possible parameters:
             * 1) parentCategoryId: This is a number which uniquely identifies a category in our system. Not easy to determine.
             * 2) parentCategoryPath: This is the folder path you wish to retrieve, starting with a forward slash "/"
             * If you provide neither of these values, all items are returned.
             */

            // Increase timeout for long-running operation
            // Note: In C# we don't need to explicitly set execution time limits like in PHP

            ItemApi itemApi = new ItemApi(Constants.ApiKey);
            
            List<Item> items = new List<Item>();
            
            int iteration = 1;
            int offset = 0;
            int limit = 200;
            bool moreRecordsToFetch = true;
            
            try
            {
                while (moreRecordsToFetch)
                {
                    Console.WriteLine($"executing iteration {iteration}");
                    
                    List<Item> chunkOfItems = GetItemChunk(itemApi, offset, limit);
                    items = items.Concat(chunkOfItems).ToList();
                    offset += limit;
                    moreRecordsToFetch = chunkOfItems.Count == limit;
                    iteration++;
                }
            }
            catch (com.ultracart.admin.v2.Client.ApiException e)
            {
                Console.WriteLine($"ApiException occurred on iteration {iteration}");
                Console.WriteLine(e.ToString());
                Environment.Exit(1);
            }
            
            // this will be verbose...
            foreach (Item item in items)
            {
                Console.WriteLine(item.ToString());
            }
        }
        
        /// <summary>
        /// Get a chunk of items from the API
        /// </summary>
        /// <param name="itemApi">ItemApi instance</param>
        /// <param name="offset">Starting offset for retrieval</param>
        /// <param name="limit">Maximum number of records to retrieve</param>
        /// <returns>List of retrieved items</returns>
        private static List<Item> GetItemChunk(ItemApi itemApi, int offset, int limit)
        {
            // The real devil in the getItem calls is the expansion, making sure you return everything you need without
            // returning everything since these objects are extremely large.
            // These are the possible expansion values.
            /*
            accounting                      amember                     auto_order                      auto_order.steps
            ccbill                          channel_partner_mappings    chargeback                      checkout
            content                         content.assignments         content.attributes              content.multimedia
            content.multimedia.thumbnails   digital_delivery            ebay                            email_notifications
            enrollment123                   gift_certificate            google_product_search           kit_definition
            identifiers                     instant_payment_notifications   internal                    options
            payment_processing              physical                    pricing                         pricing.tiers
            realtime_pricing                related                     reporting                       restriction
            reviews                         salesforce                  shipping                        shipping.cases
            tax                             third_party_email_marketing variations                      wishlist_member
            shipping.destination_markups
            shipping.destination_restrictions
            shipping.distribution_centers
            shipping.methods
            shipping.package_requirements
            */
            string expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure
            
            int? parentCategoryId = null;
            string parentCategoryPath = null;
            string since = null;
            string sort = null;
            
            ItemsResponse apiResponse = itemApi.GetItems(parentCategoryId, parentCategoryPath, limit, offset, since,
                sort, expand, false);
            
            if (apiResponse.Items != null)
            {
                return apiResponse.Items;
            }
            
            return new List<Item>();
        }
    }
}