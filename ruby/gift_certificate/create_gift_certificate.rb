
require 'date'
require 'json'
require 'yaml'
require 'ultracart_api'
require '../Constants'

api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY)

create_request = UltracartClient::GiftCertificateCreateRequest.new

expiration_dts = DateTime.now + 90
create_request.amount = 150.75
create_request.initial_ledger_description = "Issued instead of refund"
create_request.merchant_note = 'Problem Order: blah-12345\nIssued gift certificate due to stale product.\nIssued By: Customer Service Rep Joe Smith'
create_request.email = 'support@ultracart.com'
create_request.expiration_dts = expiration_dts.iso8601


# create does not take an expansion variable.  it will return the entire object by default.
api_response = api.create_gift_certificate(create_request)
gift_certificate = api_response.gift_certificate

puts gift_certificate.to_yaml
