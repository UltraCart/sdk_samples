using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class CityState
    {
        /// <summary>
        /// Takes a postal code and returns back a city and state (US Only)
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout
            // Takes a postal code and returns back a city and state (US Only)

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            String cartId = "123456789123456789123456789123456789";  // you should have the cart id from session or cookie.
            Cart cart = new Cart();
            cart.CartId = cartId; // required
            cart.Shipping = new CartShipping();
            cart.Shipping.PostalCode = "44233";

            CityStateZip apiResponse = checkoutApi.CityState(cart);
            Console.WriteLine("City: " + apiResponse.City);
            Console.WriteLine("State: " + apiResponse.State);
        }
    }
}