from ultracart.apis import CheckoutApi
from ultracart.models import CartValidationRequest
from samples import api_client

# Initialize the checkout API
checkout_api = CheckoutApi(api_client())

# Cart ID would normally come from session or cookie
cart_id = '123456789123456789123456789123456789'

# Define expansion string for detailed cart information
expand = "items,billing,shipping,coupons,checkout,payment,summary,taxes"

# Get the cart
cart = checkout_api.get_cart_by_cart_id(cart_id, expand=expand).cart

# Create validation request
validation_request = CartValidationRequest(cart=cart)
# validation_request.checks = None  # leave as None for all validations

# Possible checks:
"""
All, Advertising Source Provided, Billing Address Provided,
Billing Destination Restriction, Billing Phone Numbers Provided, Billing State Abbreviation Valid, Billing Validate City State Zip,
Coupon Zip Code Restriction, Credit Card Shipping Method Conflict, Customer Profile Does Not Exist., CVV2 Not Required,
Electronic Check Confirm Account Number, Email confirmed, Email provided if required, Gift Message Length, Item Quantity Valid,
Item Restrictions, Items Present, Merchant Specific Item Relationships, One per customer violations, Options Provided,
Payment Information Validate, Payment Method Provided, Payment Method Restriction, Pricing Tier Limits, Quantity requirements met,
Referral Code Provided, Shipping Address Provided, Shipping Destination Restriction, Shipping Method Provided,
Shipping Needs Recalculation, Shipping State Abbreviation Valid, Shipping Validate City State Zip, Special Instructions Length,
Tax County Specified, Valid Delivery Date, Valid Ship On Date, Auth Test Credit Card
"""

# Validate cart and get updated cart in response
api_response = checkout_api.validate_cart(validation_request, expand=expand)
cart = api_response.cart

# Handle validation errors
validation_errors = api_response.errors