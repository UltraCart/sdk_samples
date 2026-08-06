# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

=begin
 Search orders by the card BIN (first six digits) plus the last four digits.

 A dispute or chargeback record from your gateway rarely carries the UltraCart order id, but it almost
 always carries the card BIN, the last four digits, the transaction amount and the transaction date.
 Matching on date + total + last four alone tends to return many orders, especially for subscription
 merchants where rebills share the same amount. Adding the BIN pins the search to the specific card.

 Rules enforced by the API:
   - card_bin and card_last4 MUST be supplied together; neither works on its own.
   - card_bin is exactly 6 digits, card_last4 is exactly 4 digits (digits only).
   - ALWAYS send four digits in card_last4, including for American Express.
   - payment_date_begin AND payment_date_end are REQUIRED alongside the card fields.
   - The search is served from the cache; leave query_target unset (an explicit "origin" is rejected).

 A malformed card filter is a hard 400 rather than a silently ignored parameter, so you can never
 mistake an unfiltered result set for a set of genuine card matches.

 The example values below are illustrative - substitute the BIN / last four / amount / dates from your
 own gateway or chargeback record.
=end

order_api = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)
expansion = 'summary,payment,billing'

def print_matches(label, api_response)
  orders = api_response.orders || []
  puts "#{label}: #{orders.length} order(s) matched"
  orders.each { |order| puts "  #{order.order_id}" }
end

# Search #1 - reconcile a dispute using the card and a payment date window.
# Widen the window about a week on either side of the transaction date. That is inexpensive here because
# the card is doing the real narrowing, and it absorbs any timezone difference between your gateway's
# reporting and the payment timestamp recorded on the order.
query = UltracartClient::OrderQuery.new(
  card_bin: '427162',
  card_last4: '6258',
  payment_date_begin: '2026-07-14T00:00:00+00:00',
  payment_date_end: '2026-07-28T23:59:59+00:00'
)
response = order_api.get_orders_by_query(
  order_query: query,
  opts: { '_limit' => 200, '_offset' => 0, '_expand' => expansion }
)
print_matches('Dispute reconciliation by card', response)

# Search #2 - add the transaction amount when you trust it.
# Include total for extra precision. Leave it off when partial captures, surcharges or currency
# conversion make an exact amount match unreliable.
query = UltracartClient::OrderQuery.new(
  card_bin: '427162',
  card_last4: '6258',
  payment_date_begin: '2026-07-14T00:00:00+00:00',
  payment_date_end: '2026-07-28T23:59:59+00:00',
  total: 49.95
)
response = order_api.get_orders_by_query(
  order_query: query,
  opts: { '_limit' => 200, '_offset' => 0, '_expand' => expansion }
)
print_matches('Dispute reconciliation by card and amount', response)

# Search #3 - American Express. Still send FOUR digits in card_last4.
# The API applies the AMEX specific reduction internally; do not send three digits.
query = UltracartClient::OrderQuery.new(
  card_bin: '371234',
  card_last4: '5678',
  payment_date_begin: '2026-07-14T00:00:00+00:00',
  payment_date_end: '2026-07-28T23:59:59+00:00'
)
response = order_api.get_orders_by_query(
  order_query: query,
  opts: { '_limit' => 200, '_offset' => 0, '_expand' => expansion }
)
print_matches('American Express', response)
