from ultracart.apis import AutoOrderApi
from ultracart.models import AutoOrderConsolidate
from samples import api_client


# consolidateAutoOrders
# an auto order with no items, the original_order is used for shipping, billing, and payment information.
# Once you have your empty auto order, add items to it and call updateAutoOrder.

def consolidate_auto_orders():
    auto_order_api = AutoOrderApi(api_client())

    # see https://www.ultracart.com/api/#resource_auto_order.html for list
    expand = "items,items.future_schedules,original_order,rebill_orders"

    # set getAutoOrdersByQuery for retrieving auto orders where you can get their auto_order_oid
    target_auto_order_oid = 123456789

    consolidate_request = AutoOrderConsolidate()
    # these are the autoorder_oids you wish to consolidate into the target
    consolidate_request.source_auto_order_oids = [23456789, 3456789]

    api_response = auto_order_api.consolidate_auto_orders(
        target_auto_order_oid,
        consolidate_request,
        expand=expand
    )

    consolidated_auto_order = api_response.auto_order

    # TODO: make sure the consolidated order has all the items and history of all orders
    print(consolidated_auto_order)


if __name__ == "__main__":
    consolidate_auto_orders()