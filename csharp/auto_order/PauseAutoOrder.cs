using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.channel_partner
{
    public class PauseAutoOrder
    {
        /*
         * This is a convenience method created for an UltraCart merchant to pause a large number of auto orders
         * due to an inventory shortage. This is not new functionality and can be accomplished with the normal updateAutoOrder
         * call. It does the following logic to an auto order:
         * for each item in the auto order:
         *    if the item is not paused, pause it, setPause(true)
         * save the changes by calling updateAutoOrder()
         *
         * Some warnings if you choose to use this method.
         * There are no convenience methods to unpause auto orders.
         * There are no convenience methods to query which auto orders are paused.
         * We do not recommend pausing auto orders and the merchant is on their own to manage auto order state if they
         * choose to begin pausing orders. Keep good track of what you're doing.
         *
         */
        public static void Execute()
        {
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

            string expand = "items"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
            int autoOrderOid = 123456789; // get an auto order and update it. There are many ways to retrieve an auto order.
            AutoOrderResponse getResponse = autoOrderApi.GetAutoOrder(autoOrderOid);
            AutoOrder autoOrder = getResponse.AutoOrder;

            AutoOrderResponse pauseResponse = autoOrderApi.PauseAutoOrder(autoOrderOid, autoOrder);
            AutoOrder pausedAutoOrder = pauseResponse.AutoOrder;
            System.Console.WriteLine(pausedAutoOrder);
        }
    }
}