import { channelPartnerApi } from '../api.js';

/**
 * Retrieves a list of all channel partners reject and reason codes the merchant may have configured.
 */
export class GetChannelPartnerReasonCodes {
    /**
     * Execute method to retrieve channel partner refund and reject reason codes
     */
    static async execute() {
        console.log(`--- ${this.name} ---`);

        try {
            // Retrieve channel partners
            const apiResponse = await new Promise((resolve, reject) => {
                channelPartnerApi.getChannelPartnerReasonCodes(18413, function (error, data, response) {
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

            console.log(apiResponse);

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
