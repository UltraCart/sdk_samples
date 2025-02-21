from ultracart.apis import CustomerApi
from samples import api_client
from ultracart.models import CustomerStoreCreditAddRequest

# Create the customer API instance
customer_api = CustomerApi(api_client())

# Set the email and retrieve customer
email = "test@ultracart.com"
customer = customer_api.get_customer_by_email(email).customer
customer_oid = customer.customer_profile_oid

# Create store credit request
store_credit_request = CustomerStoreCreditAddRequest(
    amount=20.00,
    description="Customer is super cool and I wanted to give them store credit.",
    expiration_days=365,  # or leave None for no expiration
    vesting_days=45  # customer has to wait 45 days to use it
)

# Add store credit
api_response = customer_api.add_customer_store_credit(customer_oid, store_credit_request)

# Check for errors
if api_response.error is not None:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

# Print the success response
print(api_response.success)