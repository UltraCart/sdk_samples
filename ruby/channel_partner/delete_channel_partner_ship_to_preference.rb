require 'ultracart_api'
require_relative '../constants'

# Deletes a ChannelPartnerShiptoPreference.  These preferences are used by EDI channel partners to automatically
# apply return policies and add additional free items to EDI orders based on the EDI code that is present.
#
# Success will return a status code 204 (No content)
#
# Possible Errors:
# Attempting to interact with a channel partner other than the one tied to your API Key:
#     "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
# Supply a bad preference oid: "Invalid channel_partner_ship_to_preference_oid specified."

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)

# you will usually get this by calling get_channel_partner_ship_to_preferences()
channel_partner_shipto_preference_oid = 67890
channel_partner_oid = 12345

channel_partner_api.delete_channel_partner_ship_to_preference(channel_partner_oid, channel_partner_shipto_preference_oid)