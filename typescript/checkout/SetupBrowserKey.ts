import {checkoutApi} from '../api';
import {
    CheckoutSetupBrowserKeyRequest,
    CheckoutSetupBrowserKeyResponse
} from 'ultracart_rest_api_v2_typescript';

export class SetupBrowserKey {
    /**
     * Creates a browser key for use in a client-side checkout.
     *
     * This call must be made server-side with a Simple API Key or an OAuth access token.
     */
    public static async execute(): Promise<void> {
        try {
            // Prepare the browser key request
            const keyRequest: CheckoutSetupBrowserKeyRequest = {
                allowed_referrers: ["https://www.mywebsite.com"]
            };

            // Setup the browser key
            const apiResponse: CheckoutSetupBrowserKeyResponse = await checkoutApi.setupBrowserKey({browserKeyRequest: keyRequest});
            const browserKey: string = apiResponse.browser_key || "";

            // Output the browser key
            console.log(browserKey);

        } catch (error) {
            console.error("Error setting up browser key:", error);
        }
    }
}