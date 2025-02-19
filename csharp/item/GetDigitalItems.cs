using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.item
{
    public class GetDigitalItems
    {
        public static void Execute()
        {
            try
            {
                /*
                 * Please Note!
                 * Digital Items are not normal items you sell on your site. They are digital files that you may add to
                 * a library and then attach to a normal item as an accessory or the main item itself.
                 * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
                 */

                int digitalItemOid = ItemFunctions.InsertSampleDigitalItem(); // create an item so I can get an item
                ItemApi itemApi = Samples.GetItemApi();

                int limit = 100;
                int offset = 0;
                string since = null; // digital items do not use since. leave as null.
                string sort = null; // if null, use default of original_filename
                string expand = null; // digital items have no expansion. leave as null. this value is ignored
                bool? placeholders = null; // digital items have no placeholders. leave as null.

                ItemDigitalItemsResponse apiResponse = itemApi.GetDigitalItems(limit, offset, since, sort, expand, placeholders);
                List<ItemDigitalItem> digitalItems = apiResponse.DigitalItems; // assuming this succeeded

                Console.WriteLine("The following items were retrieved via GetDigitalItems():");
                foreach (ItemDigitalItem digitalItem in digitalItems)
                {
                    Console.WriteLine(digitalItem);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception occurred. Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}