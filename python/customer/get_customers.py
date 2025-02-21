import time
from typing import List, Optional
from ultracart.apis import CustomerApi
from ultracart.api_client import ApiException

from samples import api_client


def get_customer_chunk(
        customer_api: CustomerApi,
        offset: int,
        limit: int
) -> List[dict]:
    """
    Retrieve a chunk of customers with specified expansion and pagination.

    Possible expansion values include:
    attachments, billing, cards, cc_emails, loyalty, orders_summary,
    pricing_tiers, privacy, properties, quotes_summary, reviewer,
    shipping, software_entitlements, tags, tax_codes
    """
    # Just the address fields. Contact support if unsure.
    expand = "shipping,billing"

    # Set all search parameters to None
    search_params = {
        'email': None,
        'qb_class': None,
        'quickbooks_code': None,
        'last_modified_dts_start': None,
        'last_modified_dts_end': None,
        'signup_dts_start': None,
        'signup_dts_end': None,
        'billing_first_name': None,
        'billing_last_name': None,
        'billing_company': None,
        'billing_city': None,
        'billing_state': None,
        'billing_postal_code': None,
        'billing_country_code': None,
        'billing_day_phone': None,
        'billing_evening_phone': None,
        'shipping_first_name': None,
        'shipping_last_name': None,
        'shipping_company': None,
        'shipping_city': None,
        'shipping_state': None,
        'shipping_postal_code': None,
        'shipping_country_code': None,
        'shipping_day_phone': None,
        'shipping_evening_phone': None,
        'pricing_tier_oid': None,
        'pricing_tier_name': None,
        'limit': limit,
        'offset': offset,
        'since': None,
        'sort': None,
        'expand': expand
    }

    # Remove keys with None values to match UltraCart API expectations
    filtered_params = {k: v for k, v in search_params.items() if v is not None}

    # Retrieve customer chunk
    api_response = customer_api.get_customers(**filtered_params)

    # Return customers or empty list
    return api_response.customers or []


def retrieve_all_customers():
    """
    Retrieve all customers using pagination.

    Note: TODO - Consider using getCustomersByQuery for easier retrieval.
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

            # Merge customers
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
        # This is just a rough approximation
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