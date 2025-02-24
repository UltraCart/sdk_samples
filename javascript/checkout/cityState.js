import { checkoutApi } from '../api.js';

/// <summary>
/// Takes a postal code and returns back a city and state (US Only)
/// </summary>
export class CityState {
    /// <summary>
    /// Takes a postal code and returns back a city and state (US Only)
    /// </summary>
    static async Execute() {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout
        // Takes a postal code and returns back a city and state (US Only)

        const cartId = "123456789123456789123456789123456789";  // you should have the cart id from session or cookie.
        const cart = {
            cart_id: cartId, // required
            shipping: {
                postal_code: "44233"
            }
        };

        try {
            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.cityState(cart, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            console.log("City: " + apiResponse.city);
            console.log("State: " + apiResponse.state);
        } catch (error) {
            console.error("Error retrieving city and state:", error);
        }
    }
}