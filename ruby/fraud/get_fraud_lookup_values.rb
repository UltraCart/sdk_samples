# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# get_fraud_lookup_values returns the lookup values used when building fraud rules:
# the allowed countries, affiliates, ip range types, rule groups, and rule types.
# Call this first when constructing a rule so you supply valid values.

fraud_api = UltracartClient::FraudApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

api_response = fraud_api.get_fraud_lookup_values

lookup_values = api_response.fraud_lookup_values

puts 'Rule types:'
puts lookup_values.rule_types.inspect

puts 'Rule groups:'
puts lookup_values.rule_groups.inspect

puts 'IP range types:'
puts lookup_values.ip_range_types.inspect

puts 'Countries:'
puts lookup_values.countries.inspect
