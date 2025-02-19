using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.item
{
    public class DeleteDigitalItem
    {
        public static void Execute()
        {
            try
            {
                int digitalItemOid = ItemFunctions.InsertSampleDigitalItem();
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