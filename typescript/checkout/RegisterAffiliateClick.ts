import {checkoutApi} from '../api';
import {
    RegisterAffiliateClickRequest,
    RegisterAffiliateClickResponse
} from 'ultracart_rest_api_v2_typescript';

export class RegisterAffiliateClick {
    /**
     * Records an affiliate click.
     *
     * Reference Implementation: https://github.com/UltraCart/responsive_checkout
     */
    public static async execute(): Promise<void> {
        try {
            // Note: In TypeScript, you'll need to get these values from your request context
            // This is a simplified example - implement proper request handling in your application
            const ipAddress = "127.0.0.1"; // Replace with actual implementation to get IP
            const userAgent = ""; // Replace with actual implementation to get user agent
            const refererUrl = ""; // Replace with actual implementation to get referer URL

            const clickRequest: RegisterAffiliateClickRequest = {
                ip_address: ipAddress,
                user_agent: userAgent,
                referrer_url: refererUrl,
                affid: 123456789, // you should know this from your UltraCart affiliate system
                subid: "TODO:SupplyThisValue",
                // landingPageUrl: undefined,  // if you have landing page url
            };

            const apiResponse: RegisterAffiliateClickResponse = await checkoutApi.registerAffiliateClick({registerAffiliateClickRequest: clickRequest});

            console.log(JSON.stringify(apiResponse, null, 2));
        } catch (error) {
            console.error("Error registering affiliate click:", error);
        }
    }
}