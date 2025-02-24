import {checkoutApi} from '../api';
import {Cart, CartItem, CartResponse, Item, ItemsResponse} from 'ultracart_rest_api_v2_typescript';

export class RelatedItemsForItem {
    /**
     * Retrieves items related to the items within the cart, in addition to another item id.
     * Item relations are configured in the UltraCart backend.
     *
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     *
     * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377171/Related+Items
     *
     * Note: The returned items have a fixed expansion (only so many item properties are returned).
     * Item expansion includes:
     * content, content.assignments, content.attributes, content.multimedia,
     * content.multimedia.thumbnails, options, pricing, and pricing.tiers
     */
    public static async execute(): Promise<void> {
        try {
            // Expansion options for the cart
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
            const expand = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes";

            // In TypeScript web application, you'd get the cookie from your request context
            let cartId: string | undefined;
            // Example of how you might get the cookie
            // cartId = request.cookies["UltraCartShoppingCartID"];

            let cart: Cart | undefined;
            let apiResponse: CartResponse;

            if (!cartId) {
                apiResponse = await checkoutApi.getCart({expand});
                cart = apiResponse.cart;
            } else {
                apiResponse = await checkoutApi.getCartByCartId({
                    cartId: cartId,
                    expand
                });
                cart = apiResponse.cart;
            }

            if (cart === undefined) {
                console.error("Could not get a cart from UltraCart, cannot continue.");
                return;
            }

            // Add some items to the cart and update
            cart.items = [{
                item_id: "ITEM_ABC",
                quantity: 1
            }];

            // Update the cart and assign it back to our variable
            cart = (await checkoutApi.updateCart({
                cart: cart,
                expand
            })).cart;

            if (cart === undefined) {
                console.error("Could not get a cart from UltraCart, cannot continue.");
                return;
            }

            // Another item ID to find related items for
            const anotherItemId = "ITEM_ZZZ";

            // Get related items for the specific item and cart
            const apiResponse2: ItemsResponse = await checkoutApi.relatedItemsForItem({
                itemId: anotherItemId,
                cart: cart,
                expand
            });
            const relatedItems: Item[] = apiResponse2.items || [];

            // Output related items
            console.log("<html lang=\"en\"><body><pre>");
            relatedItems.forEach(item => {
                console.log(JSON.stringify(item, null, 2));
            });
            console.log("</pre></body></html>");

        } catch (error) {
            console.error("Error retrieving related items:", error);
        }
    }
}