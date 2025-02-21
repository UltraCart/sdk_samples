from ultracart.apis import CustomerApi
from ultracart.api_client import ApiException

from samples import api_client
from customer_functions import insert_sample_customer, delete_sample_customer

def update_customer_example():
    """
    Demonstrate customer retrieval, update, and deletion:
    1. Insert a sample customer
    2. Retrieve customer details
    3. Update billing address
    4. Verify the update
    5. Delete the sample customer
    """
    try:
        # Insert a sample customer
        customer_oid = insert_sample_customer()

        # Create API client
        customer_api = CustomerApi(api_client())

        # Specify expansion fields (just want address fields)
        # See https://www.ultracart.com/api/#resource_customer.html for all expansion values
        expand = "billing,shipping"

        # Retrieve customer details
        customer = customer_api.get_customer(customer_oid, expand).customer

        # TODO: Modify customer details
        # Change billing address (assuming first billing entry)
        customer.billing[0].address2 = 'Apartment 101'

        # Update customer
        # Notice expand is passed to update to get back the same fields for comparison
        api_response = customer_api.update_customer(customer_oid, customer, expand)

        # Verify the update
        print(api_response.customer)

        # Clean up the sample customer
        delete_sample_customer(customer_oid)

    except ApiException as e:
        print('An ApiException occurred. Please review the following error:')
        print(e)
        raise

# Run the function if the script is executed directly
if __name__ == '__main__':
    update_customer_example()