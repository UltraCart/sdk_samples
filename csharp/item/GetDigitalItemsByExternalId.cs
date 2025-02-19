using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.item
{
    public class GetDigitalItemsByExternalId
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

                string externalId = Guid.NewGuid().ToString("N");
                Console.WriteLine("My external id is " + externalId);
                int digitalItemOid = ItemFunctions.InsertSampleDigitalItem(externalId); // create digital item with a specific external id I can later use.
                ItemApi itemApi = Samples.GetItemApi();
                ItemDigitalItemsResponse apiResponse = itemApi.GetDigitalItemsByExternalId(externalId);
                List<ItemDigitalItem> digitalItems = apiResponse.DigitalItems; // assuming this succeeded

                Console.WriteLine("The following item was retrieved via GetDigitalItem():");
                Console.WriteLine(digitalItems);

                ItemFunctions.DeleteSampleDigitalItem(digitalItemOid);
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