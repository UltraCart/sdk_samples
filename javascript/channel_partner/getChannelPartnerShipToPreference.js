import { channelPartnerApi } from '../api.js';

/**
 * Retrieves a shipto preference for a channel partner.
 * These preferences are used by EDI channel partners to automatically
 * apply return policies and add additional free items to EDI orders based on the EDI code that is present.
 *
 * Possible Errors:
 * Attempting to interact with a channel partner other than the one tied to your API Key:
 *    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 * Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
 * Supplying a bad channel partner shipto preference oid: "Invalid channel_partner_ship_to_preference_oid specified."
 */
export async function execute() {
    console.log(`--- ${execute.name} ---`);

    try {
        // Channel partner OID and shipto preference OID
        const channelPartnerOid = 12345;
        const channelPartnerShiptoPreferenceOid = 67890;

        // Retrieve channel partner shipto preference
        const apiResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.getChannelPartnerShipToPreference(
                channelPartnerOid,
                channelPartnerShipToPreferenceOid
            , function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        // Check for errors in the API response
        if (apiResponse.error) {
            const error = apiResponse.error;
            console.error(error.developer_message);
            console.error(error.user_message);
            process.exit(1);
        }

        // Extract and log the preference
        const preference = apiResponse.ship_to_preference;
        console.log(preference);

    } catch (ex) {
        // Handle any unexpected errors
        const error = ex instanceof Error ? ex : new Error('Unknown error');
        console.error(`Error: ${error.message}`);
        console.error(error.stack);
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    execute().catch(console.error);
}
