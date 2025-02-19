using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class FinalizeOrder
    {
        /// <summary>
        /// Finalizes an order from a cart
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // Note: You probably should NOT be using this method.  Use handoffCart() instead.
            // This method is a server-side only (no browser key allowed) method for turning a cart into an order.
            // It exists for merchants who wish to provide their own upsells, but again, a warning, using this method
            // will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
            // Still, some merchants need this functionality, so here it is.  If you're unsure, you don't need it.  Use handoff.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            String expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
            // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
            /*
            affiliate                   checkout                            customer_profile
            billing                     coupons                             gift
            gift_certificate            items.attributes                   items.multimedia
            items                       items.multimedia.thumbnails         items.physical
            marketing                   payment                                settings.gift
            settings.billing.provinces  settings.shipping.deliver_on_date   settings.shipping.estimates
            settings.shipping.provinces settings.shipping.ship_on_date     settings.taxes
            settings.terms              shipping                           taxes
            summary                     upsell_after
             */

            String cartId = "123456789123456789123456789123456789"; // get the cart id from session or cookie.  beyond this sample scope.
            
            CartResponse cartResponse = checkoutApi.GetCartByCartId(cartId, expansion);
            Cart cart = cartResponse.Cart;

            // TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

            CartFinalizeOrderRequest finalizeRequest = new CartFinalizeOrderRequest();
            finalizeRequest.Cart = cart;
            CartFinalizeOrderRequestOptions finalizeOptions = new CartFinalizeOrderRequestOptions(); // Lots of options here.  Contact support if you're unsure what you need.
            finalizeRequest.Options = finalizeOptions;

            CartFinalizeOrderResponse orderResponse = checkoutApi.FinalizeOrder(finalizeRequest);
            // orderResponse.Successful;
            // orderResponse.Errors;
            // orderResponse.OrderId;
            // orderResponse.Order;


            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(orderResponse, Newtonsoft.Json.Formatting.Indented));

        }
    }
}