require 'json'
require 'yaml'
require 'ultracart_api'
require '../Constants'

api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY)

def get_gift_certificates_chuck(api, offset, limit)
  expansion = 'ledger'.freeze
  query = UltracartClient::GiftCertificateQuery.new # leaving this empty, so no filtering, and I should get all records returned.
  api_response = api.get_gift_certificates_by_query(query, { _limit: limit, _offset: offset, _expand: expansion })
  return api_response.gift_certificates unless api_response.gift_certificates.nil?

  []
end


gift_certificates = []

iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

while more_records_to_fetch

  puts "executing iteration #{iteration}"
  chuck_of_certificates = get_gift_certificates_chuck(api, offset, limit)
  gift_certificates.push(*chuck_of_certificates)
  offset += limit
  more_records_to_fetch = chuck_of_certificates.length == limit
  iteration += 1

end

puts gift_certificates.to_yaml
