from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# OrderApi.resendReceipt() will resend (email) a receipt to a customer.

# Initialize the Order API with the API key
order_api = OrderApi(api_client())

# The order ID to resend the receipt for
order_id = 'DEMO-0009104436'

# Call to resend the receipt
try:
    api_response = order_api.resend_receipt(order_id)
except ApiException as e:
    print(f"Exception when calling OrderApi->resend_receipt: {e}")
    exit()

# Check if there was an error in the API response
if hasattr(api_response, 'error') and api_response.error is not None:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    print('Order could not be adjusted. See the error log.')
    exit()

# Output the result
if api_response.success:
    print('Receipt was resent.')
else:
    print('Failed to resend receipt.')
