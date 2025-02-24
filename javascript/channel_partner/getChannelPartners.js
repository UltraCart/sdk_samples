import { channelPartnerApi } from '../api.js';

/**
 * Retrieves a list of all channel partners configured for this merchant.
 * If the API KEY used is tied to a specific Channel Partner, then the results
 * will contain only that Channel Partner.
 */
export class GetChannelPartners {
    /**
     * Execute method to retrieve channel partners
     */
    static async execute() {
        console.log(`--- ${this.name} ---`);

        try {
            // Retrieve channel partners
            const apiResponse = await new Promise((resolve, reject) => {
                channelPartnerApi.getChannelPartners(function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            // Check for any errors in the API response
            if (apiResponse.error) {
                console.error(apiResponse.error.developer_message);
                console.error(apiResponse.error.user_message);
                process.exit(1);
            }

            // Extract channel partners
            const channelPartners = apiResponse.channelPartners || [];

            // Log each channel partner
            channelPartners.forEach(channelPartner => {
                console.log(channelPartner);
            });

            // Log total number of channel partners
            console.log(`Retrieved ${channelPartners.length} channel partners`);

        } catch (ex) {
            // Log details of the error
            if (ex instanceof Error) {
                console.error(`Error: ${ex.message}`);
                console.error(ex.stack);
            } else {
                console.error("An unknown error occurred");
            }
        }
    }
}
