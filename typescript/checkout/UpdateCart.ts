import {checkoutApi} from '../api';
import {DateTime} from 'luxon';
import {
    Cart,
    CartResponse,
    CartItem,
    CartItemOption
} from 'ultracart_rest_api_v2_typescript';

/**
 * Reference Implementation: https://github.com/UltraCart/responsive_checkout
 *
 * This example uses the getCart.php code as a starting point, because we must get a cart to update a cart.
 * This example is the same for both getCart.php and getCartByCartId.php. They work as a pair and are called
 * depending on the presence of an existing cart id or not. For new carts, getCart() is used.
 * For existing carts, getCartByCartId(cart_id) is used.
 */
export class UpdateCart {
    public static async execute(): Promise<void> {
        // For this example, we're just getting a cart to insert some items into it.
        const expand = "items";

        // In TypeScript web applications, you'd retrieve the cookie from the browser context
        let cartId: string | undefined = undefined;
        // Example of how you might retrieve a cookie in a web application:
        // cartId = document.cookie.split('; ').find(row => row.startsWith('UltraCartShoppingCartID='))?.split('=')[1];

        let cart: Cart | undefined;
        if (cartId === undefined) {
            const apiResponse: CartResponse = await checkoutApi.getCart({expand});
            cart = apiResponse.cart;
        } else {
            const apiResponse: CartResponse = await checkoutApi.getCartByCartId({cartId, expand});
            cart = apiResponse.cart;
        }

        // Get the items array on the cart, creating it if it doesn't exist
        let items: CartItem[] = cart?.items ?? [];

        // Create a new item
        const item: CartItem = {
            item_id: "BASEBALL", // TODO: Adjust the item id
            quantity: 1, // TODO: Adjust the quantity

            // TODO: If your item has options then you need to create a new CartItemOption object and add it to the list.
            options: []
        };

        // Add the item to the items list
        items.push(item);

        // Make sure to update the cart with the new list
        if (cart) {
            cart.items = items;

            // Push the cart up to save the item
            const cartResponse: CartResponse = await checkoutApi.updateCart({cart, expand});

            // Extract the updated cart from the response
            cart = cartResponse.cart;

            // TODO: set or re-set the cart cookie if this is part of a multi-page process.
            // Two weeks is a generous cart id time.
            // Example of how you might set a cookie in a web application:
            // document.cookie = `UltraCartShoppingCartID=${cart.cartId}; expires=${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;

            // In a real-world scenario, you might want to log or handle the updated cart
            console.log(JSON.stringify(cart, null, 2));
        }
    }
}