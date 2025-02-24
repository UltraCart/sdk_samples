import { checkoutApi } from '../api.js';

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
    static async execute() {
        try {
            // Note: customer_profile is a required expand for login to work properly
            const expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";

            // Create a new cart
            let cart = await new Promise((resolve, reject) => {
                checkoutApi.getCart({_expand:expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            }).then(data => data.cart);

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
            const loginRequest = {
                cart: cart, // will look for billing.email
                password: password
            };

            // Perform login
            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.login(loginRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
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
            await new Promise((resolve, reject) => {
                checkoutApi.logout(cart, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

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