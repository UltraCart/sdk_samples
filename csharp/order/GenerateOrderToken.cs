using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class GenerateOrderToken
    {
        public static void Execute()
        {
            /*
             * This method generates a unique encrypted key for an Order.  This is useful if you wish to provide links for
             * customer orders without allowing someone to easily cycle through orders.  By requiring order tokens, you
             * control which orders are viewable with a public hyperlink.
             *
             * This method works in tandem with OrderApi.getOrderByToken()
             */

            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104436";
            OrderTokenResponse orderTokenResponse = orderApi.GenerateOrderToken(orderId);
            string orderToken = orderTokenResponse.OrderToken;

            Console.WriteLine($"Order Token is: {orderToken}");

            /*
             * The token format will look something like this:
             * DEMO:UJZOGiIRLqgE3a10yp5wmEozLPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g==
             */
        }
    }
}