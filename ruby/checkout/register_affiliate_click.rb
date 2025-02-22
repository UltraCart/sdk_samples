require 'ultracart_api'
require_relative '../constants'

# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# Records an affiliate click.

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

click_request = UltracartClient::RegisterAffiliateClickRequest.new
click_request.ip_address = ENV['HTTP_X_FORWARDED_FOR'] || ENV['REMOTE_ADDR']
click_request.user_agent = ENV['HTTP_USER_AGENT'] || ''
click_request.referrer_url = ENV['HTTP_REFERER'] || ''
click_request.affid = 123_456_789 # You should know this from your UltraCart affiliate system.
click_request.subid = 'TODO:SupplyThisValue'
# click_request.landing_page_url = nil # If you have a landing page URL.

api_response = checkout_api.register_affiliate_click(click_request)

puts api_response.inspect
