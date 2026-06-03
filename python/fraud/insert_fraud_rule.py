from ultracart.apis import FraudApi
from ultracart.models import FraudRuleInsertRequest
from samples import api_client


# insert_fraud_rule creates a single fraud rule. Each rule has a rule_type (what it inspects),
# a failure_action (what happens when it matches), and type-specific fields such as an amount
# threshold, country code, ip address, or email.
#
# This sample has some fun and inserts several rules of different types in one run. Call
# get_fraud_lookup_values.py to see every valid rule_type and the other lookup values.

def insert_fraud_rule():
    fraud_api = FraudApi(api_client())

    rules = []

    # 1. Decline any order placed with a known-bad email address.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'address email'
    rule.email = 'chargeback-charlie@example.com'
    rule.failure_action = 'Decline Transaction'
    rule.auto_note = 'Known chargeback email - decline on sight'
    rules.append(rule)

    # 2. Flag large single credit card transactions over $1,000 for manual review.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'credit card single transaction exceeds'
    rule.amount_threshold = 1000.00
    rule.failure_action = 'Flag For Review'
    rule.auto_note = 'Large single transaction - review before shipping'
    rules.append(rule)

    # 3. Decline orders that ship outside the United States.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'address not in country'
    rule.country_code = 'US'
    rule.failure_action = 'Decline Transaction'
    rule.auto_note = 'Domestic shipping only'
    rules.append(rule)

    # 4. Decline transactions originating from a specific bad IP address.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'ip matches'
    rule.ip_address = '203.0.113.66'
    rule.ip_range_type = 'address'
    rule.failure_action = 'Decline Transaction'
    rule.auto_note = 'Blocked IP address'
    rules.append(rule)

    # 5. Flag prepaid credit cards for review.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'credit card block prepaid'
    rule.failure_action = 'Flag For Review'
    rule.auto_note = 'Prepaid card - take a closer look'
    rules.append(rule)

    # 6. Flag a customer IP making more than 10 transactions in a single day.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'ip daily transaction count exceeds'
    rule.count_threshold = 10
    rule.ip_range_type = 'address'
    rule.user_action = 'Attempted'
    rule.failure_action = 'Flag For Review'
    rule.auto_note = 'IP velocity - more than 10 orders in a day'
    rules.append(rule)

    for rule in rules:
        api_response = fraud_api.insert_fraud_rule(rule)
        created = api_response.fraud_rule
        print(f"Inserted '{rule.rule_type}' rule, oid = {created.fraud_rule_oid}")


if __name__ == "__main__":
    insert_fraud_rule()
