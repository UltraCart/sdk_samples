import { checkoutApi } from '../api.js';
import { DateTime } from 'luxon';

export class GetCart {
    /// <summary>
    /// Retrieves a cart either by creating a new one or getting an existing one by cart ID
    /// </summary>
    static async Execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout

        // this example is the same for both getCart.php and getCartByCartId.php.  They work as a pair and are called
        // depending on the presence of an existing cart id or not.  For new carts, getCart() is used.  For existing
        // carts, getCartByCartId($cart_id) is used.

        const expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
        // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html
        /*
        affiliate                   checkout                            customer_profile
        billing                     coupons                             gift
        gift_certificate            items.attributes                   items.multimedia
        items                       items.multimedia.thumbnails         items.physical
        marketing                   payment                                settings.gift
        settings.billing.provinces  settings.shipping.deliver_on_date   settings.shipping.estimates
        settings.shipping.provinces settings.shipping.ship_on_date     settings.taxes
        settings.terms              shipping                           taxes
        summary                     upsell_after
         */

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.getCart({_expand: expansion}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const cart = apiResponse.cart;

            if (!cart || !cart.cart_id) {
                throw new Error('No cart retrieved');
            }

            // TODO: set or re-set the cart cookie if this is part of a multi-page process. two weeks is a generous cart id time.
            // In TypeScript/browser environment, this would typically be handled using document.cookie or browser storage APIs
            this.setCookie(
                "UltraCartShoppingCartID",
                cart.cart_id,
                DateTime.now().plus({days: 14}).toJSDate()
            );

            console.log(JSON.stringify(cart, null, 2));
        } catch (error) {
            console.error('Error retrieving cart:', error);
        }
    }

    /// <summary>
    /// Sets a cookie with the given name, value, and expiration
    /// </summary>
    static setCookie(name, value, expires) {
        const cookieValue = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
        document.cookie = cookieValue;
    }
}