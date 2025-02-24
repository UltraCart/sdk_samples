import {orderApi} from '../api';
import {OrderTokenResponse} from 'ultracart_rest_api_v2_typescript';

export class GenerateOrderToken {
    /**
     * This method generates a unique encrypted key for an Order.  This is useful if you wish to provide links for
     * customer orders without allowing someone to easily cycle through orders.  By requiring order tokens, you
     * control which orders are viewable with a public hyperlink.
     *
     * This method works in tandem with OrderApi.getOrderByToken()
     */
    public static async execute(): Promise<string | undefined> {
        const orderId = 'DEMO-0009104436';

        try {
            // Generate order token
            const orderTokenResponse: OrderTokenResponse = await orderApi.generateOrderToken({orderId});
            const orderToken = orderTokenResponse.order_token;

            console.log(`Order Token is: ${orderToken}`);

            /*
             * The token format will look something like this:
             * DEMO:UJZOGiIRLqgE3a10yp5wmEozLPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g==
             */
            return orderToken;
        } catch (error) {
            console.error('Error generating order token:', error);
            throw error;
        }
    }
}

// Optional: If you want to call the method
// GenerateOrderToken.execute().then(token => {
//     // Do something with the token
// }).catch(error => {
//     // Handle any errors
// });