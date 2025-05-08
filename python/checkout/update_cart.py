from flask import request
from ultracart.apis import CheckoutApi
from ultracart.models import CartItem
from samples import api_client

# Initialize the checkout API
checkout_api = CheckoutApi(api_client())

# Set expansion to retrieve items
expand = "items"

# Check for existing cart ID in cookies
# cart_id = request.cookies.get("UltraCartShoppingCartID")
cart_id = '48E2F76C5BD1BB0196476FAACF800100'

# Get cart based on whether we have an existing cart ID
inside_web_context = False
if cart_id is None:
    api_response = checkout_api.get_cart(expand=expand)
    inside_web_context = True

else:
    api_response = checkout_api.get_cart_by_cart_id(cart_id, expand=expand)

cart = api_response.cart

# Get items array from cart, initialize if needed
items = cart.items or []

# Create new item
item = CartItem(
    item_id="BASEBALL",  # TODO: Adjust the item id
    quantity=1.0,          # TODO: Adjust the quantity
    options=[]          # TODO: If item has options, create CartItemOption objects and add to this list
)

# Add item to items array
items.append(item)

# Update cart with new items
cart.items = items

# Save updated cart
cart_response = checkout_api.update_cart(cart, expand=expand)
cart = cart_response.cart


# if inside_web_context:
#     # Create response with updated cart
#     response = {'cart': cart}
#
#     # Set cookie for cart ID - Using Flask's response object
#     @app.after_request
#     def add_cart_cookie(response):
#         response.set_cookie(
#             "UltraCartShoppingCartID",
#             cart.cart_id,
#             max_age=1209600,  # Two weeks in seconds
#             path="/"
#         )
#         return response