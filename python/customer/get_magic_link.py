import json
from ultracart.apis import CustomerApi
from samples import api_client

from customer_functions import insert_sample_customer


def main():
    try:
        # Create customer API instance
        customer_api = CustomerApi(api_client())

        # Create a sample customer
        customer_oid = insert_sample_customer()

        # Set storefront (required)
        storefront = "www.website.com"

        # Get magic link
        api_response = customer_api.get_magic_link(customer_oid, storefront)
        url = api_response.url

        # In a web application (like Flask), you would redirect to the URL
        # For this example, we'll just print the URL
        print(f"Magic Link URL: {url}")

        # Note: In a real web application, you would use a proper redirect
        # For example, in Flask:
        # return redirect(url)

        # Clean up note: Do not delete the customer if you want the magic link to work
        # deleteSampleCustomer(customer_oid)

    except Exception as e:
        print('An exception occurred. Please review the following error:')
        print(e)
        import sys
        sys.exit(1)


if __name__ == "__main__":
    main()