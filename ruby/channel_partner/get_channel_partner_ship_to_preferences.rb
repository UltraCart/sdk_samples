require 'ultracart_api'
require_relative '../constants'

# Retrieves all shipto preferences for a channel partner.
# These preferences are used by EDI channel partners to automatically
# apply return policies and add additional free items to EDI orders based on the EDI code that is present.
#
# Possible Errors:
# Attempting to interact with a channel partner other than the one tied to your API Key:
#    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
# Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)
channel_partner_oid = 12345
api_response = channel_partner_api.get_channel_partner_ship_to_preferences(channel_partner_oid)

if api_response.error
  STDERR.puts api_response.error.developer_message
  STDERR.puts api_response.error.user_message
  exit
end

preferences = api_response.ship_to_preferences

preferences.each do |preference|
  p preference
end