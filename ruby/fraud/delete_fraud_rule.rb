# frozen_string_literal: true

require 'ultracart_api'
require_relative '../constants'

# delete_fraud_rule removes a fraud rule by its oid.
#
# To keep this sample self-contained it first inserts a throwaway rule, then deletes it using
# the oid returned from the insert.  In your own code you would already have the oid of the rule
# you want to remove (for example from search_fraud_rules).

fraud_api = UltracartClient::FraudApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

# Insert a rule so we have something to delete.
rule = UltracartClient::FraudRuleInsertRequest.new(
  rule_type: 'credit card single transaction exceeds',
  amount_threshold: 2500.00,
  failure_action: 'Flag For Review',
  auto_note: 'Temporary rule created by the delete_fraud_rule sample'
)

insert_response = fraud_api.insert_fraud_rule(rule)
fraud_rule_oid = insert_response.fraud_rule.fraud_rule_oid
puts "Inserted temporary rule, oid = #{fraud_rule_oid}"

# Now delete it.
fraud_api.delete_fraud_rule(fraud_rule_oid)
puts "Deleted fraud rule oid = #{fraud_rule_oid}"
