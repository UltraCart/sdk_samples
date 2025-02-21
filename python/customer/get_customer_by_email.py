from ultracart.apis import CustomerApi
from samples import api_client

from customer_functions import (
    insert_sample_customer,
    delete_sample_customer,
    create_random_email
)


def main():
    try:
        # Create a sample customer with a random email
        email = create_random_email()
        customer_oid = insert_sample_customer(email)

        # Create customer API instance
        customer_api = CustomerApi(api_client())

        # Retrieve customer by email with expanded billing and shipping details
        # Most customer logic revolves around email, not customer OID
        api_response = customer_api.get_customer_by_email(email, expand="billing,shipping")
        customer = api_response.customer  # Assuming retrieval succeeded

        # Print customer details
        print(customer)

        # Clean up the sample customer
        delete_sample_customer(customer_oid)

    except Exception as e:
        print('An exception occurred. Please review the following error:')
        print(e)
        import sys
        sys.exit(1)


if __name__ == "__main__":
    main()