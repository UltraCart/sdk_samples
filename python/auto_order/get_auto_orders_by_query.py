import time
from typing import List
from ultracart.apis import AutoOrderApi
from ultracart.models import AutoOrderQuery
from ultracart.exceptions import ApiException
from samples import api_client

# Initialize the API client
auto_order_api = AutoOrderApi(api_client())


def get_auto_order_chunk(auto_order_api: AutoOrderApi, offset: int, limit: int) -> List:
    """
    Retrieve a chunk of auto orders with pagination.

    Args:
        auto_order_api: The AutoOrderApi instance
        offset: Starting position for fetching records
        limit: Maximum number of records to fetch

    Returns:
        List of auto orders for the current chunk
    """
    # These expansion values are from www.ultracart.com/api/
    # Please review the master website for the most current list
    expand = "items,items.future_schedules,original_order,rebill_orders"  # contact us if you're unsure what you need

    # Available sorting fields are documented in the original PHP file
    sort = "next_shipment_dts"

    query = AutoOrderQuery()
    query.email = "support@ultracart.com"

    api_response = auto_order_api.get_auto_orders_by_query(query, limit=limit, offset=offset, sort=sort, expand=expand)

    if api_response.auto_orders is not None:
        return api_response.auto_orders
    return []


def main():
    auto_orders = []
    iteration = 1
    offset = 0
    limit = 200
    more_records_to_fetch = True

    try:
        while more_records_to_fetch:
            print(f"executing iteration {iteration}")

            chunk_of_orders = get_auto_order_chunk(auto_order_api, offset, limit)
            auto_orders.extend(chunk_of_orders)
            offset += limit
            more_records_to_fetch = len(chunk_of_orders) == limit
            iteration += 1

    except ApiException as e:
        print(f"ApiException occurred on iteration {iteration}")
        print(e)
        exit(1)

    # Print the results
    print(auto_orders)


if __name__ == "__main__":
    main()