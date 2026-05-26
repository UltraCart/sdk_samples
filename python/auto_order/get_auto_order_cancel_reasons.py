from ultracart.apis import AutoOrderApi
from samples import api_client


# Retrieves the list of cancel reasons that can be presented to customers when
# cancelling an auto order (e.g., in MyAccount). Each reason includes the reason
# text, an optional MyAccount alternate description, and whether the reason is
# visible in MyAccount.

def get_auto_order_cancel_reasons():
    auto_order_api = AutoOrderApi(api_client())

    api_response = auto_order_api.get_auto_order_cancel_reasons()

    for cancel_reason in api_response.cancel_reasons:
        print(cancel_reason)


if __name__ == "__main__":
    get_auto_order_cancel_reasons()
