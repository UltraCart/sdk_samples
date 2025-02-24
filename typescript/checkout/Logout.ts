import { checkoutApi } from '../api';
import {
    Cart,
    CartProfileLoginRequest,
    CartProfileLoginResponse
} from 'ultracart_rest_api_v2_typescript';

/// <summary>
/// Handles user logout in the UltraCart system
/// </summary>
export class Logout {
    /// <summary>
    /// Logs a user OUT of the UltraCart system
    /// Reference Implementation: https://github.com/UltraCart/responsive_checkout
    ///
    /// This example assumes the shopping cart has already had a successful login.
    /// See login SDK sample for logging in help.
    /// For new carts, getCart() is used. For existing carts, getCartByCartId(cart_id) is used.
    ///
    /// Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html)
    /// </summary>
    public static async execute(): Promise<{ success: boolean }> {
        try {
            // Note: customer_profile is a required expand for login to work properly
            const expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";

            // Create a new cart
            let cart: Cart|undefined = (await checkoutApi.getCart({expand})).cart;

            if (!cart) {
                console.error("Could not get a cart from UltraCart, cannot continue.");
                return {success: false};
            }

            // Collect these from user input in a real application
            const email = "test@test.com";
            const password = "ABC123";

            // Prepare billing information
            cart.billing = {
                email: email
            };

            // Prepare login request
            const loginRequest: CartProfileLoginRequest = {
                cart: cart, // will look for billing.email
                password: password
            };

            // Perform login
            const apiResponse: CartProfileLoginResponse = await checkoutApi.login({loginRequest});
            cart = apiResponse.cart;

            // Check for login errors
            if (apiResponse.errors && apiResponse.errors.length > 0) {
                console.error("Login failed:", apiResponse.errors);
                return { success: false };
            }
            if (!cart) {
                console.error("Could not get a cart from UltraCart, cannot continue.");
                return {success: false};
            }


            // Perform logout
            await checkoutApi.logout({cart, expand});

            return { success: true };

        } catch (error) {
            console.error("Error during logout process:", error);
            return { success: false };
        }
    }
}

// Optional: If you want to call the method
// Logout.execute().then(result => {
//     if (result.success) {
//         console.log("Logout successful");
//     } else {
//         console.log("Logout failed");
//     }
// });