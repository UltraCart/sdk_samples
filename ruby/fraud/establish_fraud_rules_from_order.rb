# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# establish_fraud_rules_from_order is a shortcut that derives fraud rules from an existing order.
# Point it at an order you have identified as fraudulent and tell it which attributes of that
# order to turn into rules: the email, the credit card, the ip address, and/or the address.
# It creates the matching rules and returns them. This is the fast way to "block everything
# associated with this bad order" instead of building each rule by hand.
#
# Not every filter produces a rule; the order must actually have that attribute. For example an
# order with no stored card data will not produce a credit card rule.

fraud_api = UltracartClient::FraudApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

request = UltracartClient::FraudRuleFromOrderRequest.new(
  order_id: 'DEMO-0009104434',
  establish_email_filter: true,
  establish_card_filter: true,
  establish_ip_filter: true,
  establish_address_filter: true,
  failure_action: 'Flag For Review',
  auto_note: 'Established from fraudulent order DEMO-0009104434'
)

api_response = fraud_api.establish_fraud_rules_from_order(request)

fraud_rules = api_response.fraud_rules
puts "Established #{fraud_rules.length} rule(s) from the order:"

fraud_rules.each do |fraud_rule|
  puts "  oid #{fraud_rule.fraud_rule_oid} - #{fraud_rule.rule_type} - #{fraud_rule.auto_note}"
end
