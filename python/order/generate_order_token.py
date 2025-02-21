from ultracart.apis import OrderApi
from samples import api_client

# Create Order API instance
order_api = OrderApi(api_client())

# Define order ID
order_id = 'DEMO-0009104436'

# Generate order token
order_token_response = order_api.generate_order_token(order_id)
order_token = order_token_response.order_token

# Print the order token
print(f"Order Token is: {order_token}")

# Example token format:
# DEMO:UJZOGiIRLqgE3a10yp5wmEozLPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g==
