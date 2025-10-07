from ultracart import ApiException
from ultracart.apis import OrderApi
from ultracart.models import OrderValidationRequest
from samples import api_client

# /*
#     validateOrder may be used to check for any and all validation errors that may result from an insertOrder
#     or updateOrder call.  Because those method are built on our existing infrastructure, some validation
#     errors may not bubble up to the rest api call and instead be returned as generic "something went wrong" errors.
#     This call will return detail validation issues needing correction.
#
#     Within the ValidationRequest, you may leave the 'checks' array null to check for everything, or pass
#     an array of the specific checks you desire.  Here is a list of the checks:
#
#     "Billing Address Provided"
#     "Billing Destination Restriction"
#     "Billing Phone Numbers Provided"
#     "Billing State Abbreviation Valid"
#     "Billing Validate City State Zip"
#     "Email provided if required"
#     "Gift Message Length"
#     "Item Quantity Valid"
#     "Items Present"
#     "Merchant Specific Item Relationships"
#     "One per customer violations"
#     "Referral Code Provided"
#     "Shipping Address Provided"
#     "Shipping Destination Restriction"
#     "Shipping Method Ignore Invalid"
#     "Shipping Method Provided"
#     "Shipping State Abbreviation Valid"
#     "Shipping Validate City State Zip"
#     "Special Instructions Length"
# */


# Initialize the Order API with the API key
order_api = OrderApi(api_client())

# Define the expansion to be used in the API call (related to checkout)
expansion = "checkout"  # see the getOrder sample for expansion discussion

# The order ID to retrieve
order_id = 'DEMO-0009104976'

# Step 1: Retrieve the order
try:
    api_response = order_api.get_order(order_id, expand=expansion)
    order = api_response.order
except ApiException as e:
    print(f"Exception when calling OrderApi->get_order: {e}")
    exit()

# Output the current order details
print(order)

# TODO: Do some updates to the order here.

# Step 2: Validate the order
validation_request = OrderValidationRequest()
validation_request.order = order
# validation_request.checks = "Billing Validate City State Zip"

try:
    api_response = order_api.validate_order(validation_request)
except ApiException as e:
    print(f"Exception when calling OrderApi->validate_order: {e}")
    exit()

# Output validation errors, if any
print('Validation errors:<br>')
if api_response.errors is not None:
    for error in api_response.errors:
        print(error)

# Output validation messages, if any
print('Validation messages:<br>')
if hasattr(api_response, 'messages') and api_response.messages is not None:
    for message in api_response.messages:
        print(message)
