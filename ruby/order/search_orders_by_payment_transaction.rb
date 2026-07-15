# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

=begin
 Search orders by the key/value pairs recorded on a payment transaction.

 Each payment transaction stores the gateway's response as a set of name/value detail pairs
 (payment.transactions[].details[], e.g. authcode, transactionid, rotatingTransactionGatewayCode).
 The payment_transaction_filters field on the order query matches against those pairs, letting you
 reverse-lookup an order from a gateway/processor transaction id, or reconcile a chargeback.

 Rules enforced by the API:
   - query_target MUST be "cache" (ElasticSearch); the database path cannot search transaction details.
   - Each filter value is REQUIRED and matched EXACTLY (no wildcards).
   - A filter name is OPTIONAL; omit it to match the value across any detail name.
   - Multiple filters are AND-ed against the SAME transaction (the rotating gateway is just another pair).
   - At most 10 filters are allowed.

 The example values below are illustrative - substitute the transaction id / auth code / amount / dates
 from your own gateway or chargeback record.
=end

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)
expansion = 'summary,payment,payment.transaction'

def print_matches(label, api_response)
  orders = api_response.orders || []
  puts "#{label}: #{orders.length} order(s) matched"
  orders.each { |order| puts "  #{order.order_id}" }
end

# Search #1 - reverse-lookup an order from a gateway transaction id.
# The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
query = UltracartClient::OrderQuery.new(
  query_target: 'cache', # transaction-detail search requires the cache
  payment_transaction_filters: [
    UltracartClient::OrderQueryPaymentTransactionFilter.new(name: 'rotatingTransactionGatewayCode', value: 'NMI'),
    UltracartClient::OrderQueryPaymentTransactionFilter.new(name: 'transactionid', value: '12244247793')
  ]
)
# Tip: to match a value under ANY detail name, omit name:
#   UltracartClient::OrderQueryPaymentTransactionFilter.new(value: '12244247793')
response = order_api.get_orders_by_query(
  order_query: query,
  opts: { '_limit' => 200, '_offset' => 0, '_expand' => expansion }
)
print_matches('Search by transaction id', response)

# Search #2 - reconcile a chargeback when you do not have the order id.
# The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
# transaction amount (total) and a payment date window to uniquely identify the order.
query = UltracartClient::OrderQuery.new(
  query_target: 'cache',
  payment_transaction_filters: [
    UltracartClient::OrderQueryPaymentTransactionFilter.new(name: 'authcode', value: '100304')
  ],
  total: 77.00,
  payment_date_begin: '2026-06-29T00:00:00+00:00',
  payment_date_end: '2026-07-01T00:00:00+00:00'
)
response = order_api.get_orders_by_query(
  order_query: query,
  opts: { '_limit' => 200, '_offset' => 0, '_expand' => expansion }
)
print_matches('Chargeback reconciliation', response)
