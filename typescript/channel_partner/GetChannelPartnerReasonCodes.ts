import {
    ChannelPartner,
    ChannelPartnersResponse
} from 'ultracart_rest_api_v2_typescript';
import { channelPartnerApi } from '../api';

/**
 * Retrieves a list of all channel partners refund and reject reasons
 */
export class GetChannelPartnerReasonCodes {
    /**
     * Execute method to retrieve channel partner reason codes
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            // Retrieve channel partners
            const apiResponse: ChannelPartnersResponse = await channelPartnerApi.getChannelPartnerReasonCodes({ channelPartnerOid: 18413});

            // Check for any errors in the API response
            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            console.log(apiResponse);

        } catch (ex: unknown) {
            // Type the error as unknown and log details
            if (ex instanceof Error) {
                console.error(`Error: ${ex.message}`);
                console.error(ex.stack);
            } else {
                console.error("An unknown error occurred");
            }
        }
    }
}