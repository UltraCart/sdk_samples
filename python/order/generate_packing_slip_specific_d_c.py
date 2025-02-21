from ultracart.apis import OrderApi
from samples import api_client
import base64

# Create Order API instance
order_api = OrderApi(api_client())

# Define order ID and distribution center (DC)
order_id = 'DEMO-0009104390'
dc = 'DFLT'

# Generate packing slip for a specific distribution center
api_response = order_api.generate_packing_slip_specific_dc(dc, order_id)

# Check for errors
if api_response.error:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

# The packing slip is returned as a base64-encoded PDF
base64_packing_slip = api_response.pdf_base64

# Print the base64 packing slip
print(base64_packing_slip)
