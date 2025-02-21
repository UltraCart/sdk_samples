from ultracart.apis import CustomerApi
from ultracart.models import CustomerMergeRequest
from samples import api_client

from customer_functions import (
    insert_sample_customer,
    delete_sample_customer,
    create_random_email
)

def main():
    try:
        # Create first customer
        first_customer_oid = insert_sample_customer()

        # Create second customer with a different email
        second_email = create_random_email()
        second_customer_oid = insert_sample_customer(second_email)

        # Create merge request
        merge_request = CustomerMergeRequest(
            email=second_email
            # Alternatively, you could use:
            # customer_profile_oid=second_customer_oid
        )

        # Create customer API instance
        customer_api = CustomerApi(api_client())

        # Perform customer merge
        customer_api.merge_customer(first_customer_oid, merge_request)

        # Clean up first customer (second customer is automatically deleted by merge)
        delete_sample_customer(first_customer_oid)

    except Exception as e:
        print('An exception occurred. Please review the following error:')
        print(e)
        import sys
        sys.exit(1)

if __name__ == "__main__":
    main()