import {checkoutApi} from '../api.js';

export class RegisterAffiliateClick {
    /**
     * Records an affiliate click.
     *
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    static async execute() {
        try {
            // Note: In TypeScript, you'll need to get these values from your request context
            // This is a simplified example - implement proper request handling in your application
            const ipAddress = "127.0.0.1"; // Replace with actual implementation to get IP
            const userAgent = ""; // Replace with actual implementation to get user agent
            const refererUrl = ""; // Replace with actual implementation to get referer URL

            const clickRequest = {
                ip_address: ipAddress,
                user_agent: userAgent,
                referrer_url: refererUrl,
                affid: 123456789, // you should know this from your UltraCart affiliate system
                subid: "TODO:SupplyThisValue",
                // landingPageUrl: undefined,  // if you have landing page url
            };

            const apiResponse = await new Promise((resolve, reject) => {
                checkoutApi.registerAffiliateClick(clickRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            console.log(JSON.stringify(apiResponse, null, 2));
        } catch (error) {
            console.error("Error registering affiliate click:", error);
        }
    }
}