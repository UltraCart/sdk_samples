import { checkoutApi } from '../api';
import { CartAffirmCheckoutResponse } from 'ultracart_rest_api_v2_typescript';

export class GetAffirmCheckout {
    /// <summary>
    /// For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
    /// needed to proceed with an Affirm checkout.
    /// </summary>
    public static async Execute(): Promise<void> {
        // Reference Implementation: https://github.com/UltraCart/responsive_checkout
        // For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
        // needed to proceed with an Affirm checkout.  See https://www.affirm.com/ for details about Affirm.
        // This sample does not show the construction of the affirm checkout widgets.  See the affirm api for those examples.

        const cartId: string = "123456789123456789123456789123456789"; // this should be retrieved from a session or cookie

        try {
            const apiResponse: CartAffirmCheckoutResponse = await checkoutApi.getAffirmCheckout({cartId});

            if (apiResponse.errors && apiResponse.errors.length > 0) {
                // TODO: display errors to customer about the failure
                apiResponse.errors.forEach(error => {
                    console.log(error);
                });
            } else {
                console.log(apiResponse.checkout_json); // this is the object to send to Affirm.
            }
        } catch (error) {
            console.error('Error retrieving Affirm checkout:', error);
        }
    }
}