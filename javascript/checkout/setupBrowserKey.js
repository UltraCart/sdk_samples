import {checkoutApi} from '../api.js';

export class SetupBrowserKey {
    /**
     * Creates a browser key for use in a client-side checkout.
     *
     * This call must be made server-side with a Simple API Key or an OAuth access token.
     */
    static async execute() {
        try {
            // Prepare the browser key request
            const keyRequest = {
                allowed_referrers: ["https://www.mywebsite.com"]
            };

            // Setup the browser key
            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.setupBrowserKey(keyRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const browserKey = apiResponse.browser_key || "";

            // Output the browser key
            console.log(browserKey);

        } catch (error) {
            console.error("Error setting up browser key:", error);
        }
    }
}