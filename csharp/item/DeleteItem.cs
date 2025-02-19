using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.item
{
    public class DeleteItem
    {
        public static void Execute()
        {
            try
            {
                int itemOid = ItemFunctions.InsertSampleItemAndGetOid();
                ItemFunctions.DeleteSampleItemByOid(itemOid);
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