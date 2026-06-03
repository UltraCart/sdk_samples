from ultracart.apis import FraudApi
from ultracart.models import FraudRuleSearchRequest
from samples import api_client


# search_fraud_rules returns the fraud rules that match the supplied criteria. Every field on the
# FraudRuleSearchRequest is optional; supply only the ones you want to filter on. Pagination and
# sort are passed as keyword arguments (limit, offset, sort).
#
# This sample searches for every rule whose action is "Decline Transaction".

def search_fraud_rules():
    fraud_api = FraudApi(api_client())

    search_request = FraudRuleSearchRequest()
    search_request.failure_action = 'Decline Transaction'

    api_response = fraud_api.search_fraud_rules(search_request, limit=200, offset=0)

    fraud_rules = api_response.fraud_rules
    print(f"Found {len(fraud_rules)} rule(s) with action 'Decline Transaction'")

    # Optional fields (such as auto_note) are not always present on a returned rule, so read
    # from to_dict() to avoid AttributeError on rules that do not have them set.
    for fraud_rule in fraud_rules:
        rule = fraud_rule.to_dict()
        print(f"  oid {rule.get('fraud_rule_oid')} - {rule.get('rule_type')} - {rule.get('auto_note', '')}")


if __name__ == "__main__":
    search_fraud_rules()
