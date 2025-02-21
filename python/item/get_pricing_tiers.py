from ultracart.apis import ItemApi
from samples import api_client

try:
    """
    Possible expansion values for PricingTier object:
    - approval_notification
    - signup_notification
    """
    item_api = ItemApi(api_client())

    expand = "approval_notification,signup_notification"
    api_response = item_api.get_pricing_tiers(expand=expand)

except Exception as e:
    print('Exception occurred.')
    print(e)
    raise

print(api_response.get_pricing_tiers())