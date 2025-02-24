import { checkoutApi } from '../api.js';

export class FinalizeOrder {
    /// <summary>
    /// Finalizes an order from a cart
    /// </summary>
    static async Execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout

        // Note: You probably should NOT be using this method.  Use handoffCart() instead.
        // This method is a server-side only (no browser key allowed) method for turning a cart into an order.
        // It exists for merchants who wish to provide their own upsells, but again, a warning, using this method
        // will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
        // Still, some merchants need this functionality, so here it is.  If you're unsure, you don't need it.  Use handoff.

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

        const cartId = "123456789123456789123456789123456789"; // get the cart id from session or cookie.  beyond this sample scope.

        try {
            const cartResponse = await new Promise((resolve, reject) => {
                checkoutApi.getCartByCartId(cartId, {_expand: expansion}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const cart = cartResponse.cart;

            // TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

            if (!cart) {
                throw new Error('Cart not found');
            }

            const finalizeRequest = {
                cart: cart,
                options: {} // Lots of options here. Contact support if you're unsure what you need.
            };

            const orderResponse = await new Promise((resolve, reject) => {
                checkoutApi.finalizeOrder(finalizeRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            // orderResponse.successful;
            // orderResponse.errors;
            // orderResponse.orderId;
            // orderResponse.order;

            console.log(JSON.stringify(orderResponse, null, 2));
        } catch (error) {
            console.error('Error finalizing order:', error);
        }
    }
}