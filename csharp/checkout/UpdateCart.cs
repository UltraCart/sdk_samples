using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class UpdateCart
    {
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // this example uses the getCart.php code as a starting point, because we must get a cart to update a cart.
            // getCart.php code start ----------------------------------------------------------------------------
            // this example is the same for both getCart.php and getCartByCartId.php.  They work as a pair and are called
            // depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
            // carts, getCartByCartId(cart_id) is used.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            string expansion = "items"; // for this example, we're just getting a cart to insert some items into it.

            // In C# web applications, you'd retrieve the cookie from the HttpContext
            string cartId = null;
            // Example of how you might retrieve a cookie in ASP.NET:
            // if (HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME] != null)
            // {
            //     cartId = HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME].Value;
            // }

            Cart cart = null;
            if (cartId == null)
            {
                CartResponse apiResponse = checkoutApi.GetCart(expansion);
                cart = apiResponse.Cart;
            }
            else
            {
                CartResponse apiResponse = checkoutApi.GetCartByCartId(cartId, expansion);
                cart = apiResponse.Cart;
            }

            // getCart.php code end ----------------------------------------------------------------------------

            // for this simple example, items will be added to the cart.  so our expansion variable is simply 'items' above.
            // Get the items array on the cart, creating it if it doesn't exist.
            List<CartItem> items = cart.Items;
            // If null, go ahead and initialize it to an empty list
            if (items == null)
            {
                items = new List<CartItem>();
            }

            // Create a new item
            CartItem item = new CartItem();
            item.ItemId = "BASEBALL"; // TODO: Adjust the item id
            item.Quantity = 1; // TODO: Adjust the quantity

            // TODO: If your item has options then you need to create a new CartItemOption object and add it to the list.
            List<CartItemOption> options = new List<CartItemOption>();
            item.Options = options;

            // Add the item to the items list
            items.Add(item);

            // Make sure to update the cart with the new list
            cart.Items = items;

            // Push the cart up to save the item
            CartResponse cartResponse = checkoutApi.UpdateCart(cart, expansion);

            // Extract the updated cart from the response
            cart = cartResponse.Cart;

            // TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
            // Example of how you might set a cookie in ASP.NET:
            // HttpCookie cookie = new HttpCookie(Constants.CART_ID_COOKIE_NAME);
            // cookie.Value = cart.CartId;
            // cookie.Expires = DateTime.Now.AddDays(14); // 2 weeks
            // cookie.Path = "/";
            // HttpContext.Current.Response.Cookies.Add(cookie);

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(cart, Newtonsoft.Json.Formatting.Indented));
        }
    }
}