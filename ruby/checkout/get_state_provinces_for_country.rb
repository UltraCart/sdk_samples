# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.

require 'ultracart_api'
require_relative '../constants'

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

country_code = 'US'

api_response = checkout_api.get_state_provinces_for_country(country_code)
provinces = api_response.state_provinces

provinces.each do |province|
  puts province.inspect  # contains both name and abbreviation
end