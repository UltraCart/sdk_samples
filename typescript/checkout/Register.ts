import {checkoutApi} from '../api';
import {
    CartBilling,
    CartProfileRegisterRequest,
    CartProfileRegisterResponse
} from 'ultracart_rest_api_v2_typescript';

export class Register {
    /**
     * Registers a user in your merchant system. This will create a customer profile.
     * For new carts, getCart() is used. For existing carts, getCartByCartId(cart_id) is used.
     *
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static async execute(): Promise<void> {
        try {
            // Note: customer_profile is a required expansion for login to work properly
            // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
            const expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";

            // create a new cart (change this to an existing if you have one)
            const cartResponse = await checkoutApi.getCart({expand});
            const cart = cartResponse.cart;

            if (!cart) {
                console.error("Could not get a cart from UltraCart, cannot continue.");
                return;
            }

            const email = "test@test.com"; // collect this from user
            const password = "ABC123"; // collect this from user

            cart.billing = {
                email: email // this is the username
            } as CartBilling;

            const registerRequest: CartProfileRegisterRequest = {
                cart: cart, // will look for billing.email
                password: password
            };

            const apiResponse: CartProfileRegisterResponse = await checkoutApi.register({registerRequest});
            const updatedCart = apiResponse.cart; // Important! Get the cart from the response

            if (apiResponse.errors && apiResponse.errors.length > 0) {
                apiResponse.errors.forEach(error => {
                    console.log(error);
                });
            } else {
                console.log("Successfully registered new customer profile!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    }
}