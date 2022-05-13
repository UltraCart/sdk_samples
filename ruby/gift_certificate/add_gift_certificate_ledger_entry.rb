
require 'date'
require 'json'
require 'yaml'
require 'ultracart_api'
require '../Constants'

api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY)

gift_certificate_oid = 676_713

ledger_entry = UltracartClient::GiftCertificateLedgerEntry.new

ledger_entry.amount = -15.35  # this is the change amount in the gift certificate.  this is not a balance.  it will be subtracted from it.
ledger_entry.description = 'Customer bought something over the counter'
ledger_entry.entry_dts = DateTime.now
ledger_entry.gift_certificate_ledger_oid = 0  # the system will assign an oid.  do not assign one here.
ledger_entry.gift_certificate_oid = gift_certificate_oid  # this is an existing gift certificate oid.  I created it using createGiftCertificate.ts
ledger_entry.reference_order_id = 'BLAH-12345'; # if this ledger entry is related to an order, add it here, else use null.


# add ledger entry does not take an expansion variable.  it will return the entire object by default.
api_response = api.add_gift_certificate_ledger_entry(gift_certificate_oid, ledger_entry)
gift_certificate = api_response.gift_certificate

puts gift_certificate.to_yaml
