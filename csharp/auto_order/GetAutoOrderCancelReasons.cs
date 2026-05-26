using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    public class GetAutoOrderCancelReasons
    {
        /*
         * Retrieves the list of cancel reasons that can be presented to customers when
         * cancelling an auto order (e.g., in MyAccount). Each reason includes the reason
         * text, an optional MyAccount alternate description, and whether the reason is
         * visible in MyAccount.
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            try
            {
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

                AutoOrderCancelReasonsResponse response = autoOrderApi.GetAutoOrderCancelReasons();

                foreach (AutoOrderCancelReason cancelReason in response.CancelReasons)
                {
                    Console.WriteLine(cancelReason);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}
