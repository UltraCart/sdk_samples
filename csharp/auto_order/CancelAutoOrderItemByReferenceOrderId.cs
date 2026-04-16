using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

// NOTE: requires com.ultracart.admin.v2 version that ships CancelAutoOrderItemByReferenceOrderId.
// At the time this sample was written NuGet only had 4.1.66 — a newer publish is required.
namespace SdkSample.auto_order
{
    public class CancelAutoOrderItemByReferenceOrderId
    {
        /*
         * Cancel a single item on an auto order, identified by the reference (original) order id
         * that placed the auto order and the original item id on that order. This is useful when
         * you know the original UltraCart order id rather than the auto_order_oid.
         */
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            try
            {
                AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

                string referenceOrderId = "DEMO-12345678"; // the UltraCart order id that placed the auto order
                string originalItemId   = "ITEM001";       // the merchant item id on that original order
                string expand           = "items";         // see https://www.ultracart.com/api/#resource_auto_order.html for list

                AutoOrderResponse response = autoOrderApi.CancelAutoOrderItemByReferenceOrderId(
                    referenceOrderId,
                    originalItemId,
                    expand
                );
                AutoOrder autoOrder = response.AutoOrder;
                Console.WriteLine(autoOrder);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }
    }
}
