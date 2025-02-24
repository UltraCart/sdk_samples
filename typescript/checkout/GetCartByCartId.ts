import {CheckoutApi} from 'ultracart_rest_api_v2_typescript';
import {CartResponse, Cart} from 'ultracart_rest_api_v2_typescript';
import {checkoutApi} from '../api';
import {DateTime} from 'luxon';

/**
 * Retrieves a cart either by creating a new one or getting an existing one by cart ID
 * Reference Implementation: https://github.com/UltraCart/responsive_checkout
 *
 * This example is the same for both getCart.php and getCartByCartId.php. They work as a pair and are called
 * depending on the presence of an existing cart id or not. For new carts, getCart() is used.
 * For existing carts, getCartByCartId($cart_id) is used.
 */
export async function execute(): Promise<void> {
    // For this example, we're just getting a cart to insert some items into it.
    const expansion = "items";

    // Get from session or cookie.
    const cartId = "123456780123456780123456780123456780";

    try {
        // Perform the API call
        const apiResponse: CartResponse = await checkoutApi.getCartByCartId({cartId, expand: expansion});
        const cart: Cart | undefined = apiResponse.cart;

        if (cart) {
            // TODO: set or re-set the cart cookie if this is part of a multi-page process.
            // Two weeks is a generous cart id time.

            // Note: In a browser environment, you would use document.cookie or browser-specific cookie management
            document.cookie = `UltraCartShoppingCartID=${cart.cart_id}; expires=${DateTime.now().plus({days: 14}).toHTTP()}; path=/;`;

            // Log the cart details
            console.log(JSON.stringify(cart, null, 2));
        }
    } catch (error) {
        // Error handling
        console.error('Error retrieving cart:', error);
    }
}