import {
    ChannelPartner,
    ChannelPartnersResponse
} from 'ultracart_rest_api_v2_typescript';
import { channelPartnerApi } from '../api';

/**
 * Retrieves a list of all channel partners configured for this merchant.
 * If the API KEY used is tied to a specific Channel Partner, then the results
 * will contain only that Channel Partner.
 */
export class GetChannelPartners {
    /**
     * Execute method to retrieve channel partners
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            // Retrieve channel partners
            const apiResponse: ChannelPartnersResponse = await channelPartnerApi.getChannelPartners();

            // Check for any errors in the API response
            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            // Extract channel partners
            const channelPartners: ChannelPartner[] = apiResponse.channelPartners || [];

            // Log each channel partner
            channelPartners.forEach(channelPartner => {
                console.log(channelPartner);
            });

            // Log total number of channel partners
            console.log(`Retrieved ${channelPartners.length} channel partners`);
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