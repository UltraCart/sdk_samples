# Retrieves a list of all channel partners configured for this merchant.  If the API KEY used is tied to a specific
# Channel Partner, then the results will contain only that Channel Partner.

require 'ultracart_api'
require_relative '../constants'

channel_partner_api = UltracartClient::ChannelPartnerApi.new_using_api_key(Constants::CHANNEL_PARTNER_API_KEY)
api_response = channel_partner_api.get_channel_partners

if api_response.error
  STDERR.puts api_response.error.developer_message
  STDERR.puts api_response.error.user_message
  exit
end

channel_partners = api_response.channel_partners

channel_partners.each do |channel_partner|
  p channel_partner
end