from ultracart.apis import CustomerApi
from samples import api_client
from ultracart.models import AdjustInternalCertificateRequest

# Create the customer API instance
customer_api = CustomerApi(api_client())

# Set the email and retrieve customer
email = "test@ultracart.com"
customer = customer_api.get_customer_by_email(email).customer
customer_oid = customer.customer_profile_oid

# Create adjustment request
adjust_request = AdjustInternalCertificateRequest(
    description="Adjusting customer cashback balance because they called and complained about product.",
    expiration_days=365,  # expires in 365 days
    vesting_days=45,  # customer has to wait 45 days to use it
    adjustment_amount=59,  # add 59 to their balance
    order_id='DEMO-12345',  # or leave None. This ties the adjustment to a particular order
    entry_dts=None  # use current time
)

# Adjust internal certificate
api_response = customer_api.adjust_internal_certificate(customer_oid, adjust_request)

# Check for errors
if api_response.error is not None:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

# Print response details
print(f"Success: {api_response.success}")
print(f"Adjustment Amount: {api_response.adjustment_amount}")
print(f"Balance Amount: {api_response.balance_amount}")

# Optional: full response inspection
print(api_response)