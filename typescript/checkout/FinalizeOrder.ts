import {checkoutApi} from '../api';
import {
    Cart,
    CartResponse,
    CartFinalizeOrderRequest,
    CartFinalizeOrderResponse
} from 'ultracart_rest_api_v2_typescript';

export class FinalizeOrder {
    /// <summary>
    /// Finalizes an order from a cart
    /// </summary>
    public static async Execute(): Promise<void> {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout

        // Note: You probably should NOT be using this method.  Use handoffCart() instead.
        // This method is a server-side only (no browser key allowed) method for turning a cart into an order.
        // It exists for merchants who wish to provide their own upsells, but again, a warning, using this method
        // will exclude the customer checkout from a vast and powerful suite of functionality provided free by UltraCart.
        // Still, some merchants need this functionality, so here it is.  If you're unsure, you don't need it.  Use handoff.

        const expansion: string = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
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

        const cartId: string = "123456789123456789123456789123456789"; // get the cart id from session or cookie.  beyond this sample scope.

        try {
            const cartResponse: CartResponse = await checkoutApi.getCartByCartId({cartId, expand: expansion});
            const cart: Cart | undefined = cartResponse.cart;

            // TODO - add some items, collect billing and shipping, use hosted fields to collect payment, etc.

            if (!cart) {
                throw new Error('Cart not found');
            }

            const finalizeRequest: CartFinalizeOrderRequest = {
                cart: cart,
                options: {} // Lots of options here. Contact support if you're unsure what you need.
            };

            const orderResponse: CartFinalizeOrderResponse = await checkoutApi.finalizeOrder({finalizeRequest});
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