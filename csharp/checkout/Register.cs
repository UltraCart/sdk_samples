using System;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class Register
    {
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // Registers a user in your merchant system.  This will create a customer profile.
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
            cart.Billing.Email = email; // this is the username.

            CartProfileRegisterRequest registerRequest = new CartProfileRegisterRequest();
            registerRequest.Cart = cart; // will look for billing.email
            registerRequest.Password = password;

            CartProfileRegisterResponse apiResponse = checkoutApi.Register(registerRequest);
            cart = apiResponse.Cart; // Important!  Get the cart from the response.

            if (apiResponse.Errors?.Any() == true)
            {
                foreach (string error in apiResponse.Errors)
                {
                    Console.WriteLine(error);
                }
            }
            else
            {
                Console.WriteLine("Successfully registered new customer profile!");
            }
        }
    }
}