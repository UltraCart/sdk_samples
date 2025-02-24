import {checkoutApi} from '../api.js';

export class RelatedItemsForCart {
    /**
     * Retrieves items related to the items within the cart.
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
    static async execute() {
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
            let cartId;
            // Example of how you might get the cookie
            // cartId = request.cookies["UltraCartShoppingCartID"];

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
                cart = apiResponse.cart;
            } else {
                apiResponse = await new Promise((resolve, reject) => {
                    checkoutApi.getCartByCartId(
                        cartId,
                        {_expand:expand}, function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data, response);
                        }
                    });
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
            const updateResponse = await new Promise((resolve, reject) => {
                checkoutApi.updateCart(cart, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            cart = updateResponse.cart;

            if (cart === undefined) {
                console.error("Could not get a cart from UltraCart, cannot continue.");
                return;
            }

            // Get related items for the cart
            const apiResponse2 = await new Promise((resolve, reject) => {
                checkoutApi.relatedItemsForCart(cart, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const relatedItems = apiResponse2.items || [];

            // Output related items
            relatedItems.forEach(item => {
                console.log(JSON.stringify(item, null, 2));
            });

        } catch (error) {
            console.error("Error retrieving related items:", error);
        }
    }
}