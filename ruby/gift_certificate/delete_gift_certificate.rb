require 'json'
require 'yaml'
require 'ultracart_api'
require_relative '../constants'

api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

gift_certificate_oid = 676_713


api.delete_gift_certificate(gift_certificate_oid)

# re-querying the gift certificate will still return an object, but the deleted property will be true.
# by_oid does not take an expansion variable.  it will return the entire object by default.
api_response = api.get_gift_certificate_by_oid(gift_certificate_oid)
gift_certificate = api_response.gift_certificate

puts gift_certificate.to_yaml
