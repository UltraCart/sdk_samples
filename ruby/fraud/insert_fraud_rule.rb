# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# insert_fraud_rule creates a single fraud rule.  Each rule has a rule_type (what it inspects),
# a failure_action (what happens when it matches), and type-specific fields such as an amount
# threshold, country code, ip address, or email.
#
# This sample has some fun and inserts several rules of different types in one run.  Call
# get_fraud_lookup_values.rb to see every valid rule_type and the other lookup values.

fraud_api = UltracartClient::FraudApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

rules = []

# 1. Decline any order placed with a known-bad email address.
rules << UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'address email',
  email: 'chargeback-charlie@example.com',
  failure_action: 'Decline Transaction',
  auto_note: 'Known chargeback email - decline on sight'
)

# 2. Flag large single credit card transactions over $1,000 for manual review.
rules << UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'credit card single transaction exceeds',
  amount_threshold: 1000.00,
  failure_action: 'Flag For Review',
  auto_note: 'Large single transaction - review before shipping'
)

# 3. Decline orders that ship outside the United States.
rules << UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'address not in country',
  country_code: 'US',
  failure_action: 'Decline Transaction',
  auto_note: 'Domestic shipping only'
)

# 4. Decline transactions originating from a specific bad IP address.
rules << UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'ip matches',
  ip_address: '203.0.113.66',
  ip_range_type: 'address',
  failure_action: 'Decline Transaction',
  auto_note: 'Blocked IP address'
)

# 5. Flag prepaid credit cards for review.
rules << UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'credit card block prepaid',
  failure_action: 'Flag For Review',
  auto_note: 'Prepaid card - take a closer look'
)

# 6. Flag a customer IP making more than 10 transactions in a single day.
rules << UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'ip daily transaction count exceeds',
  count_threshold: 10,
  ip_range_type: 'address',
  user_action: 'Attempted',
  failure_action: 'Flag For Review',
  auto_note: 'IP velocity - more than 10 orders in a day'
)

rules.each do |rule|
  api_response = fraud_api.insert_fraud_rule(rule)
  created = api_response.fraud_rule
  puts "Inserted '#{rule.rule_type}' rule, oid = #{created.fraud_rule_oid}"
end
