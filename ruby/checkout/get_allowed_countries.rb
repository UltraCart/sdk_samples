# Reference Implementation: https://github.com/UltraCart/responsive_checkout
# A simple method for populating the country list boxes with all the countries this merchant has configured to accept.

require 'ultracart_api'
require_relative '../constants'

checkout_api = UltracartClient::CheckoutApi.new_using_api_key(Constants::API_KEY)

api_response = checkout_api.get_allowed_countries
allowed_countries = api_response.countries

allowed_countries.each do |country|
  puts country.inspect  # contains both iso2code and name
end