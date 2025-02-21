import time
from typing import List, Optional
from ultracart.apis import CustomerApi
from ultracart.models import CustomerQuery
from ultracart.api_client import ApiException

from samples import api_client


def get_customer_chunk(
        customer_api: CustomerApi,
        offset: int,
        limit: int
) -> List[dict]:
    """
    Retrieve a chunk of customers using query method.

    Possible expansion values include:
    attachments, billing, cards, cc_emails, loyalty, orders_summary,
    pricing_tiers, privacy, properties, quotes_summary, reviewer,
    shipping, software_entitlements, tags, tax_codes
    """
    # Just the address fields. Contact support if unsure.
    expand = "shipping,billing"

    # Create a query object (currently with no filters)
    query = CustomerQuery()

    # Optional sorting
    sort = "email"
    since = None

    # Retrieve customer chunk
    api_response = customer_api.get_customers_by_query(
        query,
        offset,
        limit,
        since=since,
        sort=sort,
        expand=expand
    )

    # Return customers or empty list
    return api_response.customers or []


def retrieve_all_customers():
    """
    Retrieve all customers using pagination with query method.
    """
    # Initialize parameters
    customers = []
    iteration = 1
    offset = 0
    limit = 200
    more_records_to_fetch = True

    try:
        # Create API client
        customer_api = CustomerApi(api_client())

        # Pagination loop
        while more_records_to_fetch:
            print(f"executing iteration {iteration}")

            # Fetch customer chunk
            chunk_of_customers = get_customer_chunk(customer_api, offset, limit)

            # Extend customers list
            customers.extend(chunk_of_customers)

            # Update pagination parameters
            offset += limit
            more_records_to_fetch = len(chunk_of_customers) == limit
            iteration += 1

    except ApiException as e:
        print(f'ApiException occurred on iteration {iteration}')
        print(e)
        raise

    # Return or print customers
    return customers


# Run the retrieval if script is executed directly
if __name__ == '__main__':
    try:
        # Simulate PHP's set_time_limit and ini_set
        # Note: In Python, these are typically handled differently depending on the environment
        start_time = time.time()
        max_execution_time = 3000  # 50 minutes

        all_customers = retrieve_all_customers()

        # Print or process customers
        print(f"Total customers retrieved: {len(all_customers)}")
        # Uncomment the following line to print full details (can be very verbose)
        # print(all_customers)

    except Exception as e:
        print("An error occurred:")
        print(e)