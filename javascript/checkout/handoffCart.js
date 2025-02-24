import { checkoutApi } from '../api.js';

/// <summary>
/// Hands off a cart to the UltraCart engine for further processing
/// </summary>
export class HandoffCart {
    /// <summary>
    /// Hands off a cart to the UltraCart engine for further processing
    /// Reference Implementation: https://github.com/UltraCart/responsive_checkout
    ///
    /// This example uses the getCart code as a starting point, because we must get a cart to handoff a cart.
    /// Here, we are handing off the cart to the ultracart engine with an operation of 'view', meaning that we
    /// simply added some items to the cart and wish for UltraCart to gather the remaining customer information
    /// as part of a normal checkout operation.
    ///
    /// Valid operations are: "view", "checkout", "paypal", "paypalcredit", "affirm", "sezzle"
    /// Besides "view", the other operations are finalizers.
    /// "checkout": finalize the transaction using a customer's personal credit card (traditional checkout)
    /// "paypal": finalize the transaction by sending the customer to PayPal
    /// </summary>
    static async execute() {
        try {
            // expand parameter to include items in the cart
            const expand = "items";

            // Get cart ID from cookie (commented out in original code)
            // In a real application, you'd replace this with your actual cookie/session management
            const cartId = undefined;

            // Retrieve cart - either by existing cart ID or create a new one
            let cart;
            let apiResponse;

            if (!cartId) {
                apiResponse = await new Promise((resolve, reject) => {
                    checkoutApi.getCart({_expand:expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data, response);
                        }
                    });
                });
            } else {
                apiResponse = await new Promise((resolve, reject) => {
                    checkoutApi.getCartByCartId(cartId, {_expand:expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data, response);
                        }
                    });
                });
            }
            cart = apiResponse.cart;

            // Prepare handoff request
            const handoffRequest = {
                cart: cart,
                operation: "View",
                error_return_url: "/some/page/on/this/php/server/that/can/handle/errors/if/ultracart/encounters/an/issue/with/this/cart.php",
                error_parameter_name: "uc_error", // name this whatever the script supplied in ->setErrorReturnUrl() will check for in the $_GET object.
                secure_host_name: "mystorefront.com" // set to desired storefront. some merchants have multiple storefronts.
            };

            // Perform cart handoff
            const handoffResponse = await new Promise((resolve, reject) => {
                checkoutApi.handoffCart(handoffRequest, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // Handle response
            if (handoffResponse.errors && handoffResponse.errors.length > 0) {
                // TODO: handle errors that might happen before handoff and manage those
                console.error("Errors during cart handoff:", handoffResponse.errors);
            } else {
                const redirectUrl = handoffResponse.redirect_to_url;
                console.log(redirectUrl);
                // In a web application, you would typically redirect the user
                // This could be done via window.location.href or a routing mechanism
                // window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error("Error during cart handoff:", error);
        }
    }
}

// Optional: If you want to call the method
// HandoffCart.execute().catch(console.error);