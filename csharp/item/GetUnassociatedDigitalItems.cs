using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class GetUnassociatedDigitalItems
    {
        /// <summary>
        /// Execute method containing all business logic
        /// </summary>
        public static void Execute()
        {
            try
            {
                /*
                 * Please Note!
                 * Digital Items are not normal items you sell on your site. They are digital files that you may add to
                 * a library and then attach to a normal item as an accessory or the main item itself.
                 * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
                 * 
                 * Retrieves a group of digital items (file information) from the account that are not yet associated with any
                 * actual items. If no parameters are specified, all digital items will be returned. Be aware that these are
                 * not normal items that can be added to a shopping cart. Rather, they are digital files that may be associated
                 * with normal items. You will need to make multiple API calls in order to retrieve the entire result set since
                 * this API performs result set pagination.
                 * 
                 * Default sort order: original_filename
                 * Possible sort orders: original_filename, description, file_size
                 */

                int digitalItemOid = ItemFunctions.InsertSampleDigitalItem(); // create an item that will be unassociated.
                ItemApi itemApi = new ItemApi(Constants.ApiKey);

                int limit = 100;
                int offset = 0;
                string since = null; // digital items do not use since. leave as null.
                string sort = null; // if null, use default of original_filename
                string expand = null; // digital items have no expansion. leave as null. this value is ignored
                bool? placeholders = null; // digital items have no placeholders. leave as null.

                ItemDigitalItemsResponse apiResponse = itemApi.GetUnassociatedDigitalItems(limit, offset, since, sort, expand, placeholders);
                List<ItemDigitalItem> digitalItems = apiResponse.DigitalItems; // assuming this succeeded

                Console.WriteLine("The following items were retrieved via GetUnassociatedDigitalItems():");
                foreach (ItemDigitalItem digitalItem in digitalItems)
                {
                    Console.WriteLine(digitalItem.ToString());
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception occurred. Please review the following error:");
                Console.WriteLine(e.ToString()); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}