using System;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class Logout
    {
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // This example logs a user OUT of the UltraCart system.
            //  It assumes the shopping cart has already had a successful login.
            // see login sdk_sample for logging in help.
            // For new carts, getCart() is used.  For existing carts, getCartByCartId(cart_id) is used.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            // Note: customer_profile is a required expansion for login to work properly
            string expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";
            // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html

            // create a new cart (change this to an existing if you have one)
            Cart cart = checkoutApi.GetCart(expansion).Cart;

            string email = "test@test.com"; // collect this from user.
            string password = "ABC123"; // collect this from user.

            cart.Billing = new CartBilling();
            cart.Billing.Email = email;

            CartProfileLoginRequest loginRequest = new CartProfileLoginRequest();
            loginRequest.Cart = cart; // will look for billing.email
            loginRequest.Password = password;

            CartProfileLoginResponse apiResponse = checkoutApi.Login(loginRequest);
            cart = apiResponse.Cart;

            if (apiResponse.Errors?.Any() == true)
            {
                // notify customer login failed. Until they login, you can't logout.
            }
            else
            {
                checkoutApi.Logout(cart, expansion); // <-- Here is the logout call.                
            }
        }
    }
}