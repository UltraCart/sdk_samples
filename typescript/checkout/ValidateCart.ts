import {checkoutApi} from '../api';
import {
    Cart,
    CartValidationRequest,
    CartValidationResponse
} from 'ultracart_rest_api_v2_typescript';

/**
 * This is a checkout api method. It can be used both server side or client side.
 * This example is a server side call using a Simple API Key.
 * See the JavaScript sdk samples if you wish to see a browser key implementation.
 *
 * validateCart passes a shopping cart to UltraCart for validation.
 */
export class ValidateCart {
    public static async execute(): Promise<void> {
        // Usually this would be retrieved from a session variable or cookie.
        const cartId = "123456789123456789123456789123456789";

        // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html)
        // also see getCart() example
        const expand = "items,billing,shipping,coupons,checkout,payment,summary,taxes";

        // Retrieve the cart
        const retrievedCartResponse = await checkoutApi.getCartByCartId({cartId, expand});
        const cart = retrievedCartResponse.cart;

        // Create validation request
        const validationRequest: CartValidationRequest = {
            cart: cart
            // validationRequest.checks = undefined; // leave this undefined for all validations
        };

        /**
         * Possible Checks:
         * All,Advertising Source Provided,Billing Address Provided,
         * Billing Destination Restriction,Billing Phone Numbers Provided,Billing State Abbreviation Valid,
         * Billing Validate City State Zip,Coupon Zip Code Restriction,Credit Card Shipping Method Conflict,
         * Customer Profile Does Not Exist.,CVV2 Not Required,Electronic Check Confirm Account Number,
         * Email confirmed,Email provided if required,Gift Message Length,Item Quantity Valid,
         * Item Restrictions,Items Present,Merchant Specific Item Relationships,One per customer violations,
         * Options Provided,Payment Information Validate,Payment Method Provided,Payment Method Restriction,
         * Pricing Tier Limits,Quantity requirements met,Referral Code Provided,Shipping Address Provided,
         * Shipping Destination Restriction,Shipping Method Provided,Shipping Needs Recalculation,
         * Shipping State Abbreviation Valid,Shipping Validate City State Zip,Special Instructions Length,
         * Tax County Specified,Valid Delivery Date,Valid Ship On Date,Auth Test Credit Card
         */

            // This method also does an update in the process, so pass in a good expansion and grab the return cart variable.
        const apiResponse: CartValidationResponse = await checkoutApi.validateCart({validationRequest, expand});
        const updatedCart = apiResponse.cart;

        // Logging validation results
        console.log("Validation Errors:");
        if (apiResponse.errors) {
            apiResponse.errors.forEach(error => {
                console.log(error);
            });
        }
        console.log(JSON.stringify(updatedCart, null, 2));
    }
}