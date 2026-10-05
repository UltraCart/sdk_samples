from ultracart.apis import AutoOrderApi
from samples import api_client


# AutoOrderApi.get_auto_order_update_billing_url() generates the url a customer can use to update
# the billing information on an auto order.  This is the same url sent in the auto order update
# billing email.
#
# Requires the auto_order_write scope because the url carries a customer access token.

def get_auto_order_update_billing_url():
    auto_order_api = AutoOrderApi(api_client())

    # If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
    auto_order_oid = 2133352
    api_response = auto_order_api.get_auto_order_update_billing_url(auto_order_oid)

    # WARNING: this url grants access to the customer's billing information.
    # In production, do not log it or expose it publicly; only deliver it to the customer.
    print(api_response.update_billing_url)


if __name__ == "__main__":
    get_auto_order_update_billing_url()
