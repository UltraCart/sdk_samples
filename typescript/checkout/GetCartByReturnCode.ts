import { CartResponse, Cart } from 'ultracart_rest_api_v2_typescript';
import { checkoutApi } from '../api';
import { DateTime } from 'luxon';

/**
 * Retrieves a cart using a return code
 * Reference Implementation: https://github.com/UltraCart/responsive_checkout
 *
 * This example returns a shopping cart given a return_code. The return_code is generated by UltraCart
 * and usually emailed to a customer. The email will provide a link to this script where you may use the
 * return_code to retrieve the customer's cart.
 *
 * Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html)
 * - affiliate                   - checkout                            - customer_profile
 * - billing                     - coupons                             - gift
 * - gift_certificate            - items.attributes                    - items.multimedia
 * - items                       - items.multimedia.thumbnails         - items.physical
 * - marketing                   - payment                             - settings.gift
 * - settings.billing.provinces  - settings.shipping.deliver_on_date   - settings.shipping.estimates
 * - settings.shipping.provinces - settings.shipping.ship_on_date      - settings.shipping.terms
 * - settings.terms              - shipping                            - taxes
 * - summary                     - upsell_after
 */
export async function execute(): Promise<void> {
    // Expansion to include multiple cart details
    const expansion = "items,billing,shipping,coupons,checkout,payment,summary,taxes";

    // Usually retrieved from a query parameter
    const returnCode = "1234567890";

    try {
        // Retrieve cart by return code
        const apiResponse: CartResponse = await checkoutApi.getCartByReturnCode({returnCode, expand: expansion});
        const cart: Cart | undefined = apiResponse.cart;

        if (cart) {
            // TODO: set or re-set the cart cookie if this is part of a multi-page process.
            // Two weeks is a generous cart id time.

            // Note: In a browser environment, you would use document.cookie or browser-specific cookie management
            document.cookie = `UltraCartShoppingCartID=${cart.cart_id}; expires=${DateTime.now().plus({ days: 14 }).toHTTP()}; path=/;`;

            // Log the cart details
            console.log(JSON.stringify(cart, null, 2));
        }
    } catch (error) {
        // Error handling
        console.error('Error retrieving cart by return code:', error);
    }
}