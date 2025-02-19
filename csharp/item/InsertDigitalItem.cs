using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class InsertDigitalItem
    {
        /// <summary>
        /// Execute method containing all business logic
        /// </summary>
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
                Console.WriteLine(e.ToString()); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}