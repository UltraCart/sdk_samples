import {channelPartnerApi} from '../api.js';

/**
 * Updates a channel partner shipto preference for a channel partner.
 * These preferences are used by EDI channel partners to automatically
 * apply return policies and add additional free items to EDI orders based on the EDI code that is present.
 *
 * Possible Errors:
 * Attempting to interact with a channel partner other than the one tied to your API Key:
 *    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 * Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
 */
export async function execute() {
    try {
        const channelPartnerOid = 12345;
        const channelPartnerShipToPreferenceOid = 67890;

        // Retrieve the existing preference
        const getResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.getChannelPartnerShipToPreference(
                {channelPartnerOid, channelPartnerShipToPreferenceOid},
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        // Check for errors in retrieval
        if (getResponse.error) {
            const error = getResponse.error;
            console.error(error.developer_message);
            console.error(error.user_message);
            process.exit(1);
        }

        // Ensure preference exists
        if (!getResponse.ship_to_preference) {
            console.error("No ship to preference found");
            process.exit(1);
        }

        // Create a copy of the preference to update
        const preference = {
            ...getResponse.ship_to_preference,
            ship_to_edi_code: "EDI_CODE_HERE",
            return_policy: "This is some return policy text that will be printed on the packing slip.",
            additional_kit_component_item_ids: ["ITEM_ID1", "ITEM_ID2", "ITEM_ID3"],
            description: "This is a merchant friendly description to help me remember what the above setting are."
        };

        // Update the preference
        const updateResponse = await new Promise((resolve, reject) => {
            channelPartnerApi.updateChannelPartnerShipToPreference(
                channelPartnerOid,
                channelPartnerShipToPreferenceOid,
                preference,
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        // Check for errors in update
        if (updateResponse.error) {
            const error = updateResponse.error;
            console.error(error.developer_message);
            console.error(error.user_message);
            process.exit(1);
        }

        // Ensure updated preference exists
        const updatedPreference = updateResponse.ship_to_preference;

        // This should equal what you submitted.
        console.log(JSON.stringify(updatedPreference, null, 2));
    } catch (ex) {
        const error = ex instanceof Error ? ex : new Error('Unknown error');
        console.error(`Error: ${error.message}`);
        console.error(error.stack);
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    execute().catch(console.error);
}
