from ultracart.apis import FraudApi
from ultracart.models import FraudRuleInsertRequest
from samples import api_client


# delete_fraud_rule removes a fraud rule by its oid.
#
# To keep this sample self-contained it first inserts a throwaway rule, then deletes it using
# the oid returned from the insert. In your own code you would already have the oid of the rule
# you want to remove (for example from search_fraud_rules).

def delete_fraud_rule():
    fraud_api = FraudApi(api_client())

    # Insert a rule so we have something to delete.
    rule = FraudRuleInsertRequest()
    rule.rule_type = 'credit card single transaction exceeds'
    rule.amount_threshold = 2500.00
    rule.failure_action = 'Flag For Review'
    rule.auto_note = 'Temporary rule created by the delete_fraud_rule sample'

    insert_response = fraud_api.insert_fraud_rule(rule)
    fraud_rule_oid = insert_response.fraud_rule.fraud_rule_oid
    print(f"Inserted temporary rule, oid = {fraud_rule_oid}")

    # Now delete it.
    fraud_api.delete_fraud_rule(fraud_rule_oid)
    print(f"Deleted fraud rule oid = {fraud_rule_oid}")


if __name__ == "__main__":
    delete_fraud_rule()
