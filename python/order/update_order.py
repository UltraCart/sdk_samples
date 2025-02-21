from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# Initialize the Order API with the API key
order_api = OrderApi(api_client())

# Define the expansion to be used in the API call (related to checkout)
expansion = "checkout"  # see the getOrder sample for expansion discussion

# The order ID to retrieve and update
order_id = 'DEMO-0009104976'

# Step 1: Retrieve the order
try:
    api_response = order_api.get_order(order_id, expansion)
    order = api_response.order
except ApiException as e:
    print(f"Exception when calling OrderApi->get_order: {e}")
    exit()

# Output the current order details
print("<html lang='en'><body><pre>")
print(order)

# TODO: Do some updates to the order here.

# Step 2: Update the order
try:
    api_response = order_api.update_order(order_id, order, expansion)
except ApiException as e:
    print(f"Exception when calling OrderApi->update_order: {e}")
    exit()

# Check for errors in the API response
if api_response.error is not None:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

# Output the updated order details
updated_order = api_response.order
print(updated_order)
