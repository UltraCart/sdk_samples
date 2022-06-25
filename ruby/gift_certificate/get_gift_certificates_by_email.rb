require 'json'
require 'yaml'
require 'ultracart_api'
require_relative '../constants'

api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

email = 'support@ultracart.com'

# by_email does not take an expansion variable.  it will return the entire object by default.
api_response = api.get_gift_certificates_by_email(email)
gift_certificates = api_response.gift_certificates

puts gift_certificates.to_yaml