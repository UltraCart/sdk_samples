using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Client;

namespace SdkSample.item
{
    public class UpdateItems
    {
        public static void Execute()
        {
            try
            {
                string itemId1 = ItemFunctions.InsertSampleItem();
                string itemId2 = ItemFunctions.InsertSampleItem();

                ItemApi itemApi = new ItemApi(Constants.ApiKey);

                // See one of the getItem or getItems samples for possible expansion values
                // See also: https://www.ultracart.com/api/#resource_item.html
                string expand = "pricing";
                ItemResponse apiResponse = itemApi.GetItemByMerchantItemId(itemId1, expand, false);
                Item item1 = apiResponse.Item;
                apiResponse = itemApi.GetItemByMerchantItemId(itemId2, expand, false);
                Item item2 = apiResponse.Item;

                // update the price of the item.
                item1.Pricing.Cost = 12.99m;
                item2.Pricing.Cost = 14.99m;

                ItemsRequest updateItemsRequest = new ItemsRequest();
                updateItemsRequest.Items = new List<Item>{item1, item2};
                ItemsResponse updateItemsResponse = itemApi.UpdateItems(updateItemsRequest, expand, false, false);

                ItemFunctions.DeleteSampleItem(itemId1);
                ItemFunctions.DeleteSampleItem(itemId2);
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