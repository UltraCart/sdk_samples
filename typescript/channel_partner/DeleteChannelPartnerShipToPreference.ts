import {channelPartnerApi} from '../api';

/**
 * Deletes a ChannelPartnerShiptoPreference.  These preferences are used by EDI channel partners to automatically
 * apply return policies and add additional free items to EDI orders based on the EDI code that is present.
 *
 * Success will return a status code 204 (No content)
 *
 * Possible Errors:
 * Attempting to interact with a channel partner other than the one tied to your API Key:
 *    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 * Supply a bad preference oid: "Invalid channel_partner_ship_to_preference_oid specified."
 */
export class DeleteChannelPartnerShipToPreference {
    /**
     * Execute method to delete a channel partner ship to preference
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            // Channel partner ship to preference OID to delete (usually obtained from getChannelPartnerShipToPreferences())
            const channelPartnerShiptoPreferenceOid: number = 67890;
            const channelPartnerOid: number = 12345;

            // Delete the channel partner ship to preference
            await channelPartnerApi.deleteChannelPartnerShipToPreference({
                channelPartnerOid,
                channelPartnerShipToPreferenceOid: channelPartnerShiptoPreferenceOid
            });

            console.log("Channel partner ship to preference deleted successfully");
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