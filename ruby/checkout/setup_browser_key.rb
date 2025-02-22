require 'ultracart_api'
require_relative '../constants'

# This is a checkout API method. It creates a browser key for use in a client-side checkout.
# This call must be made server-side with a Simple API Key or an OAuth access token.

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

key_request = UltracartClient::CheckoutSetupBrowserKeyRequest.new
key_request.allowed_referrers = ["https://www.mywebsite.com"]

browser_key = checkout_api.setup_browser_key(key_request).browser_key

puts browser_key.inspect
