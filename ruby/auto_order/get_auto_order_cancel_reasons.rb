require 'ultracart_api'
require_relative '../constants'

# Retrieves the list of cancel reasons that can be presented to customers when
# cancelling an auto order (e.g., in MyAccount). Each reason includes the reason
# text, an optional MyAccount alternate description, and whether the reason is
# visible in MyAccount.

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

api_response = auto_order_api.get_auto_order_cancel_reasons

api_response.cancel_reasons.each do |cancel_reason|
  puts cancel_reason.inspect
end
