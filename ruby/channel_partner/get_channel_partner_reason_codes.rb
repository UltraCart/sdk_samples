# Retrieves a list of all channel partners reject and refund reason codes needed (maybe) when doing a refund order

require 'ultracart_api'
require_relative '../constants'

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)
api_response = channel_partner_api.get_channel_partner_reason_codes(18_413)

if api_response.error
  STDERR.puts api_response.error.developer_message
  STDERR.puts api_response.error.user_message
  exit
end

p api_response