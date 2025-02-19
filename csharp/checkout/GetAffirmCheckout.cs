using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class GetAffirmCheckout
    {
        /// <summary>
        /// For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
        /// needed to proceed with an Affirm checkout.
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout
            // For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
            // needed to proceed with an Affirm checkout.  See https://www.affirm.com/ for details about Affirm.
            // This sample does not show the construction of the affirm checkout widgets.  See the affirm api for those examples.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);
            String cartId = "123456789123456789123456789123456789"; // this should be retrieved from a session or cookie
            CartAffirmCheckoutResponse apiResponse = checkoutApi.GetAffirmCheckout(cartId);
            if (apiResponse.Errors != null && apiResponse.Errors.Count > 0)
            {
                // TODO: display errors to customer about the failure
                foreach (String error in apiResponse.Errors)
                {
                    Console.WriteLine(error);
                }
            }
            else
            {
                Console.WriteLine(apiResponse.CheckoutJson); // this is the object to send to Affirm.
            }
        }
    }
}