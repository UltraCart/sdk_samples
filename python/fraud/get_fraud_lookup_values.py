from ultracart.apis import FraudApi
from samples import api_client


# get_fraud_lookup_values returns the lookup values used when building fraud rules:
# the allowed countries, affiliates, ip range types, rule groups, and rule types.
# Call this first when constructing a rule so you supply valid values.

def get_fraud_lookup_values():
    fraud_api = FraudApi(api_client())

    api_response = fraud_api.get_fraud_lookup_values()
    lookup_values = api_response.fraud_lookup_values

    print("Rule types:")
    print(lookup_values.rule_types)

    print("Rule groups:")
    print(lookup_values.rule_groups)

    print("IP range types:")
    print(lookup_values.ip_range_types)

    print("Countries:")
    print(lookup_values.countries)


if __name__ == "__main__":
    get_fraud_lookup_values()
