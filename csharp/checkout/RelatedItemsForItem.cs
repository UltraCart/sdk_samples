using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.checkout
{
    public class RelatedItemsForItem
    {
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout

            // Retrieves items related to the items within the cart, in addition to another item id you supply.
            // Item relations are configured in the UltraCart backend.
            // See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377171/Related+Items

            // Note: The returned items have a fixed expansion (only so many item properties are returned).  The item expansion is:
            // content, content.assignments, content.attributes, content.multimedia, content.multimedia.thumbnails, options, pricing, and pricing.tiers

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            string expansion = "customer_profile,items,billing,shipping,coupons,checkout,payment,summary,taxes"; //
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

            // In C# web application, you'd get the cookie from HttpContext
            string cartId = null;
            // Example of how you might get the cookie in ASP.NET
            // if (HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME] != null)
            // {
            //     cartId = HttpContext.Current.Request.Cookies[Constants.CART_ID_COOKIE_NAME].Value;
            // }

            Cart cart = null;
            if (cartId == null)
            {
                CartResponse apiResponse = checkoutApi.GetCart(expansion);
                cart = apiResponse.Cart;
            }
            else
            {
                CartResponse apiResponse = checkoutApi.GetCartByCartId(cartId, expansion);
                cart = apiResponse.Cart;
            }

            // TODO - add some items to the cart and update.

            List<CartItem> items = new List<CartItem>();
            CartItem cartItem = new CartItem();
            cartItem.ItemId = "ITEM_ABC";
            cartItem.Quantity = 1;
            items.Add(cartItem);
            cart.Items = items;

            // update the cart and assign it back to our variable.
            cart = checkoutApi.UpdateCart(cart, expansion).Cart;

            string anotherItemId = "ITEM_ZZZ";

            ItemsResponse apiResponse2 = checkoutApi.RelatedItemsForItem(anotherItemId, cart, expansion);
            List<Item> relatedItems = apiResponse2.Items;

            Console.WriteLine("<html lang=\"en\"><body><pre>");
            foreach (Item item in relatedItems)
            {
                Console.WriteLine(item.ToString());
            }
            Console.WriteLine("</pre></body></html>");
        }
    }
}