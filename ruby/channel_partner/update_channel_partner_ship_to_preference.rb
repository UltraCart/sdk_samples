# Updates a channel partner shipto preference for a channel partner.
# These preferences are used by EDI channel partners to automatically
# apply return policies and add additional free items to EDI orders based on the EDI code that is present.
#
# Possible Errors:
# Attempting to interact with a channel partner other than the one tied to your API Key:
#    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
# Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."

require 'ultracart_api'
require_relative '../constants'

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)
channel_partner_oid = 12345
channel_partner_ship_to_preference_oid = 67890

api_response = channel_partner_api.get_channel_partner_ship_to_preference(channel_partner_oid, channel_partner_ship_to_preference_oid)

preference = api_response.ship_to_preference
# Update some fields.
preference.ship_to_edi_code = 'EDI_CODE_HERE'
preference.return_policy = "This is some return policy text that will be printed on the packing slip."
preference.additional_kit_component_item_ids = ['ITEM_ID1', 'ITEM_ID2', 'ITEM_ID3']
preference.description = "This is a merchant friendly description to help me remember what the above setting are."

api_response = channel_partner_api.update_channel_partner_ship_to_preference(channel_partner_oid, channel_partner_ship_to_preference_oid, preference)

if api_response.error
  STDERR.puts api_response.error.developer_message
  STDERR.puts api_response.error.user_message
  exit
end

updated_preference = api_response.ship_to_preference

# This should equal what you submitted.
p updated_preference