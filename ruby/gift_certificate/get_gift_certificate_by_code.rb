require 'json'
require 'yaml'
require 'ultracart_api'
require '../Constants'

api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY)

code = '74BX2Q8B7K'

# by_code does not take an expansion variable.  it will return the entire object by default.
api_response = api.get_gift_certificate_by_code(code)
gift_certificate = api_response.gift_certificate

puts gift_certificate.to_yaml
