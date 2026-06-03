from ultracart.apis import FraudApi
from ultracart.models import FraudRuleFromOrderRequest
from samples import api_client


# establish_fraud_rules_from_order is a shortcut that derives fraud rules from an existing order.
# Point it at an order you have identified as fraudulent and tell it which attributes of that
# order to turn into rules: the email, the credit card, the ip address, and/or the address.
# It creates the matching rules and returns them. This is the fast way to "block everything
# associated with this bad order" instead of building each rule by hand.
#
# Not every filter produces a rule; the order must actually have that attribute. For example an
# order with no stored card data will not produce a credit card rule.

def establish_fraud_rules_from_order():
    fraud_api = FraudApi(api_client())

    request = FraudRuleFromOrderRequest()
    request.order_id = 'DEMO-0009104434'
    request.establish_email_filter = True
    request.establish_card_filter = True
    request.establish_ip_filter = True
    request.establish_address_filter = True
    request.failure_action = 'Flag For Review'
    request.auto_note = 'Established from fraudulent order DEMO-0009104434'

    api_response = fraud_api.establish_fraud_rules_from_order(request)

    fraud_rules = api_response.fraud_rules
    print(f"Established {len(fraud_rules)} rule(s) from the order:")
    for fraud_rule in fraud_rules:
        rule = fraud_rule.to_dict()
        print(f"  oid {rule.get('fraud_rule_oid')} - {rule.get('rule_type')} - {rule.get('auto_note', '')}")


if __name__ == "__main__":
    establish_fraud_rules_from_order()
