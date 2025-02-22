# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# For a given cart id (the cart should be fully updated in UltraCart), returns back the json object
# needed to proceed with an Affirm checkout.  See https://www.affirm.com/ for details about Affirm.
# This sample does not show the construction of the affirm checkout widgets.  See the affirm api for those examples.

require 'ultracart_api'
require_relative '../constants'

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)
cart_id = '123456789123456789123456789123456789'  # this should be retrieved from a session or cookie
api_response = checkout_api.get_affirm_checkout(cart_id)
if !api_response.errors.nil? && api_response.errors.length > 0
  # TODO: display errors to customer about the failure
  api_response.errors.each do |error|
    puts error.inspect
  end
else
  puts api_response.checkout_json.inspect  # this is the object to send to Affirm.
end