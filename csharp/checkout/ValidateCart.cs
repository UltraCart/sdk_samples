using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class ValidateCart
    {
        public static void Execute()
        {
            /*
                This is a checkout api method.  It can be used both server side or client side.  This example is a server side
                call using a Simple API Key.  See the JavaScript sdk samples if you wish to see a browser key implementation.

                validateCart passes a shopping cart to UltraCart for validation.
             */

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);
            string cartId = "123456789123456789123456789123456789"; // usually this would be retrieved from a session variable or cookie.

            string expansion = "items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
            // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html) also see getCart() example


            Cart cart = checkoutApi.GetCartByCartId(cartId, expansion).Cart;

            CartValidationRequest validationRequest = new CartValidationRequest();
            validationRequest.Cart = cart;
            // validationRequest.Checks = null; // leave this null for all validations
            // Possible Checks
            /*
            All,Advertising Source Provided,Billing Address Provided,
            Billing Destination Restriction,Billing Phone Numbers Provided,Billing State Abbreviation Valid,Billing Validate City State Zip,
            Coupon Zip Code Restriction,Credit Card Shipping Method Conflict,Customer Profile Does Not Exist.,CVV2 Not Required,
            Electronic Check Confirm Account Number,Email confirmed,Email provided if required,Gift Message Length,Item Quantity Valid,
            Item Restrictions,Items Present,Merchant Specific Item Relationships,One per customer violations,Options Provided,
            Payment Information Validate,Payment Method Provided,Payment Method Restriction,Pricing Tier Limits,Quantity requirements met,
            Referral Code Provided,Shipping Address Provided,Shipping Destination Restriction,Shipping Method Provided,
            Shipping Needs Recalculation,Shipping State Abbreviation Valid,Shipping Validate City State Zip,Special Instructions Length,
            Tax County Specified,Valid Delivery Date,Valid Ship On Date,Auth Test Credit Card
             */

            // This method also does an update in the process, so pass in a good expansion and grab the return cart variable.
            CartValidationResponse apiResponse = checkoutApi.ValidateCart(validationRequest, expansion);
            cart = apiResponse.Cart;

            Console.WriteLine("<html lang=\"en\"><body><pre>");
            Console.WriteLine("Validation Errors:");
            if (apiResponse.Errors != null)
            {
                foreach (string error in apiResponse.Errors)
                {
                    Console.WriteLine(error);
                }
            }
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(cart, Newtonsoft.Json.Formatting.Indented));
        }
    }
}