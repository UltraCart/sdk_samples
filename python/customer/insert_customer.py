from ultracart.api_client import ApiException

from customer_functions import insert_sample_customer, delete_sample_customer


def create_and_delete_customer():
    """
    Demonstrate creating and immediately deleting a sample customer.
    """
    try:
        # Insert a sample customer
        customer_oid = insert_sample_customer()

        # Delete the sample customer
        delete_sample_customer(customer_oid)

    except ApiException as e:
        print('An ApiException occurred. Please review the following error:')
        print(e)
        raise


# Run the function if the script is executed directly
if __name__ == '__main__':
    create_and_delete_customer()