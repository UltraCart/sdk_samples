using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.item
{
    public class GetInventorySnapshot
    {
        public static void Execute()
        {
            try
            {

                // Retrieve a list of item inventories.
                // This method may be called once every 15 minutes.  More than that will result in a 429 response.
                ItemApi itemApi = Samples.GetItemApi();
                ItemInventorySnapshotResponse snapshotResponse = itemApi.GetInventorySnapshot();
                foreach (ItemInventorySnapshot inventory in snapshotResponse.Inventories)
                {
                    Console.WriteLine(JsonConvert.SerializeObject(inventory, new JsonSerializerSettings { Formatting = Formatting.Indented}));                    
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