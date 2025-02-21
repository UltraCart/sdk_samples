import random
import string
from typing import Optional

from ultracart.apis import CustomerApi
from samples import api_client
from ultracart.models import Customer, CustomerBilling, CustomerShipping


def create_random_email() -> str:
    """Generate a random email for testing purposes."""
    rand = ''.join(random.choices(string.ascii_uppercase, k=8))
    return f'sample_{rand}.test.com'


def insert_sample_customer(email: Optional[str] = None) -> int:
    """
    Insert a sample customer and return the customer profile OID.

    Args:
        email (Optional[str]): Email for the customer. If None, a random email is generated.

    Returns:
        int: The newly created customer's customer_profile_oid
    """
    # Generate random string if no email provided
    rand = ''.join(random.choices(string.ascii_uppercase, k=8))

    if email is None:
        email = f'sample_{rand}.test.com'

    print(f'insertSampleCustomer will attempt to create customer {email}')

    # Create customer API instance
    customer_api = CustomerApi(api_client())

    # Create new customer object
    new_customer = Customer(
        email=email,
        billing=[
            CustomerBilling(
                first_name=f"First{rand}",
                last_name=f"Last{rand}",
                company=f"Company{rand}",
                country_code="US",
                state_region="GA",
                city="Duluth",
                postal_code="30097",
                address1="11960 Johns Creek Parkway"
            )
        ],
        shipping=[
            CustomerShipping(
                first_name=f"First{rand}",
                last_name=f"Last{rand}",
                company=f"Company{rand}",
                country_code="US",
                state_region="GA",
                city="Duluth",
                postal_code="30097",
                address1="11960 Johns Creek Parkway"
            )
        ]
    )

    # Expansion variable to get billing and shipping details
    expand = 'billing,shipping'

    print('insertCustomer request object follows:')
    print(new_customer)

    # Insert customer
    api_response = customer_api.insert_customer(new_customer, expand=expand)

    print('insertCustomer response object follows:')
    print(api_response)

    return api_response.customer.customer_profile_oid


def delete_sample_customer(customer_oid: int) -> None:
    """
    Delete a sample customer by their OID.

    Args:
        customer_oid (int): Customer OID to be deleted
    """
    # Create customer API instance
    customer_api = CustomerApi(api_client())

    print(f'calling deleteCustomer({customer_oid})')
    customer_api.delete_customer(customer_oid)


# Example usage
if __name__ == "__main__":
    try:
        # Create a sample customer
        new_customer_oid = insert_sample_customer()

        # Optionally delete the customer
        delete_sample_customer(new_customer_oid)

    except Exception as e:
        print(f"An error occurred: {e}")