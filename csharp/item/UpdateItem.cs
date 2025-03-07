using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using System;
using com.ultracart.admin.v2.Client;

namespace SdkSample.item
{
    public class UpdateItem
    {
        public static void Execute()
        {
            try
            {
                string itemId = ItemFunctions.InsertSampleItem();

                ItemApi itemApi = new ItemApi(Constants.ApiKey);

                // See one of the getItem or getItems samples for possible expansion values
                // See also: https://www.ultracart.com/api/#resource_item.html
                string expand = "pricing";
                ItemResponse apiResponse = itemApi.GetItemByMerchantItemId(itemId, expand, false);
                Item item = apiResponse.Item;
                decimal originalPrice = item.Pricing.Cost;

                // update the price of the item.
                ItemPricing itemPricing = item.Pricing;
                itemPricing.Cost = 12.99m;

                apiResponse = itemApi.UpdateItem(item.MerchantItemOid, item, expand, false);
                Item updatedItem = apiResponse.Item;

                // ensure the price was updated.
                Console.WriteLine("Original Price: " + originalPrice);
                Console.WriteLine("Updated Price: " + updatedItem.Pricing.Cost);

                ItemFunctions.DeleteSampleItem(itemId);
            }
            catch (ApiException e)
            {
                Console.WriteLine("An ApiException occurred.  Please review the following error:");
                Console.WriteLine(e); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}