import {
    ChannelPartnerShipToPreference, ModelError
} from 'ultracart_rest_api_v2_typescript';
import {channelPartnerApi} from '../api';

/**
 * Inserts a channel partner shipto preference for a channel partner.
 * These preferences are used by EDI channel partners to automatically
 * apply return policies and add additional free items to EDI orders based on the EDI code that is present.
 *
 * Possible Errors:
 * Attempting to interact with a channel partner other than the one tied to your API Key:
 *    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 * Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."
 */
export async function execute(): Promise<void> {
    console.log(`--- ${execute.name} ---`);

    try {
        // Channel partner OID
        const channelPartnerOid: number = 12345;

        // Create ship to preference
        const preference: ChannelPartnerShipToPreference = {
            channel_partner_oid: channelPartnerOid,
            ship_to_edi_code: "EDI_CODE_HERE",
            return_policy: "This is some return policy text that will be printed on the packing slip.",
            additional_kit_component_item_ids: ["ITEM_ID1", "ITEM_ID2", "ITEM_ID3"],
            description: "This is a merchant friendly description to help me remember what the above setting are."
        };

        // Insert the ship to preference
        const apiResponse = await channelPartnerApi.insertChannelPartnerShipToPreference({
            channelPartnerOid,
            shipToPreference: preference
        });

        // Check for errors in the API response
        if (apiResponse.error) {
            const error: ModelError = apiResponse.error;
            console.error(error.developer_message);
            console.error(error.user_message);
            process.exit(1);
        }

        // Extract and log the inserted preference
        const insertedPreference = apiResponse.ship_to_preference;

        // This should equal what you submitted.
        console.log(insertedPreference);
        console.log("Ship to preference inserted successfully");
    } catch (ex: unknown) {
        // Handle any unexpected errors
        const error = ex as Error;
        console.error(`Error: ${error.message}`);
        console.error(error.stack);
    }
}

// Optional: If you want to run this directly
if (require.main === module) {
    execute().catch(console.error);
}