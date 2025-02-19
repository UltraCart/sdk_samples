using System;


namespace SdkSample.item
{
    public class InsertItem
    {
        public static void Execute()
        {
            try
            {
                string itemId = ItemFunctions.InsertSampleItem();
                ItemFunctions.DeleteSampleItem(itemId);
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception occurred. Please review the following error:");
                Console.WriteLine(e.ToString()); // handle gracefully
                Environment.Exit(1);
            }
        }
    }
}