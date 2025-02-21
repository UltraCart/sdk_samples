from ultracart.apis import CustomerApi
from ultracart.models import CustomerStoreCreditAddRequest
from ultracart.api_client import ApiException

from samples import api_client
from customer_functions import insert_sample_customer, delete_sample_customer

def add_customer_store_credit():
    try:
        # Create API instance
        customer_api = CustomerApi(api_client())

        # Create a customer
        customer_oid = insert_sample_customer()

        # First store credit addition
        add_request_1 = CustomerStoreCreditAddRequest(
            description='First credit add',
            vesting_days=10,
            expiration_days=20,  # that's not a lot of time!
            amount=20
        )
        customer_api.add_customer_store_credit(customer_oid, add_request_1)

        # Second store credit addition
        add_request_2 = CustomerStoreCreditAddRequest(
            description='Second credit add',
            vesting_days=0,  # immediately available
            expiration_days=90,
            amount=40
        )
        customer_api.add_customer_store_credit(customer_oid, add_request_2)

        # Retrieve store credit information
        api_response = customer_api.get_customer_store_credit(customer_oid)
        store_credit = api_response.customer_store_credit

        # Print store credit details
        print(store_credit)  # Using print instead of var_dump

        # Clean up the sample
        delete_sample_customer(customer_oid)

    except ApiException as e:
        print('An ApiException occurred. Please review the following error:')
        print(e)
        raise

# Run the function if the script is executed directly
if __name__ == '__main__':
    add_customer_store_credit()