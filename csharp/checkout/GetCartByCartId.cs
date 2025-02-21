using System;
using System.Web;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using RestSharp;

namespace SdkSample.checkout
{
    public class GetCartByCartId
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

            String expansion = "items"; // for this example, we're just getting a cart to insert some items into it.

            String cartId = "123456780123456780123456780123456780"; // get from session or cookie.
            CartResponse apiResponse = checkoutApi.GetCartByCartId(cartId, expansion);
            Cart cart = apiResponse.Cart;

            // TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
            HttpCookie cookie = new HttpCookie(Constants.CartIdCookieName);
            cookie.Value = cart.CartId;
            cookie.Expires = DateTime.Now.AddDays(14); // 1209600 seconds = 14 days
            cookie.Path = "/";
            // HttpContext.Current.Response.Cookies.Add(cookie);

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(cart, Newtonsoft.Json.Formatting.Indented));
        }
    }
}
