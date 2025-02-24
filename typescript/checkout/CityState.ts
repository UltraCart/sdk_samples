import {checkoutApi} from '../api';
import {Cart, CityStateZip} from 'ultracart_rest_api_v2_typescript';

/// <summary>
/// Takes a postal code and returns back a city and state (US Only)
/// </summary>
export class CityState {
    /// <summary>
    /// Takes a postal code and returns back a city and state (US Only)
    /// </summary>
    public static async Execute(): Promise<void> {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout
        // Takes a postal code and returns back a city and state (US Only)

        const cartId: string = "123456789123456789123456789123456789";  // you should have the cart id from session or cookie.
        const cart: Cart = {
            cart_id: cartId, // required
            shipping: {
                postal_code: "44233"
            }
        };

        try {
            const apiResponse: CityStateZip = await checkoutApi.cityState({cart});
            console.log("City: " + apiResponse.city);
            console.log("State: " + apiResponse.state);
        } catch (error) {
            console.error("Error retrieving city and state:", error);
        }
    }
}