using System;
using System.Web;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using RestSharp;

namespace SdkSample.checkout
{
    public class GetCart
    {
        /// <summary>
        /// Retrieves a cart either by creating a new one or getting an existing one by cart ID
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // this example is the same for both getCart.php and getCartByCartId.php.  They work as a pair and are called
            // depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
            // carts, getCartByCartId($cart_id) is used.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            string expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
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

            string cartId = null; // no cart id yet.  GetCart will return a new cart.
            CartResponse apiResponse = checkoutApi.GetCart(expansion);
            Cart cart  = apiResponse.Cart;

            // TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
            HttpCookie cookie = new HttpCookie();
            cookie.Name = Constants.CartIdCookieName;
            cookie.Value = cart.CartId;
            cookie.Expires = DateTime.Now.AddDays(14); // 1209600 seconds = 14 days
            cookie.Path = "/";
            // HttpContext.Current.Response.Cookies.Add(cookie);

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(cart, Newtonsoft.Json.Formatting.Indented));
        }
    }
}