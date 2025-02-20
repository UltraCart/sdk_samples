from ultracart.apis import AutoOrderApi
from samples import api_client


# retrieves an auto_order given the auto_order_oid

def get_auto_order():
    auto_order_api = AutoOrderApi(api_client())

    # see https://www.ultracart.com/api/#resource_auto_order.html for list
    expand = "items,items.future_schedules,original_order,rebill_orders"

    # If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
    auto_order_oid = 123456789
    api_response = auto_order_api.get_auto_order(auto_order_oid, expand=expand)
    auto_order = api_response.auto_order
    print(auto_order)


if __name__ == "__main__":
    get_auto_order()