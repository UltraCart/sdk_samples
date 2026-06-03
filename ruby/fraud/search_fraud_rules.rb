# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# search_fraud_rules returns the fraud rules that match the supplied criteria.  Every field on the
# FraudRuleSearchRequest is optional; supply only the ones you want to filter on.  Pagination and
# sort are passed as options (_limit, _offset, _sort).
#
# This sample searches for every rule whose action is "Decline Transaction".

fraud_api = UltracartClient::FraudApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

search_request = UltracartClient::FraudRuleSearchRequest.new(
  failure_action: 'Decline Transaction'
)

api_response = fraud_api.search_fraud_rules(search_request, { _limit: 200, _offset: 0 })

fraud_rules = api_response.fraud_rules
puts "Found #{fraud_rules.length} rule(s) with action 'Decline Transaction'"

fraud_rules.each do |fraud_rule|
  puts "  oid #{fraud_rule.fraud_rule_oid} - #{fraud_rule.rule_type} - #{fraud_rule.auto_note}"
end
