using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.item
{
    public class GetDigitalItem
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
                ItemDigitalItemResponse apiResponse = itemApi.GetDigitalItem(digitalItemOid);
                ItemDigitalItem digitalItem = apiResponse.DigitalItem; // assuming this succeeded

                Console.WriteLine("The following item was retrieved via GetDigitalItem():");
                Console.WriteLine(digitalItem);

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