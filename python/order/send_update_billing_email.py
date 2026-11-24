from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# OrderApi.send_update_billing_email() emails the customer a link to update their billing information on an order
# that is in Accounts Receivable.  It is the API version of the "Send Billing Update" button on the
# Accounts Receivable Process Payment screen.  The email goes out within a minute.
#
# While the order is less than 7 days old, UltraCart sends a reminder every 2 days after this email.
#
# The call is refused (HTTP 400, raised as an ApiException) when:
# - the order is not in Accounts Receivable
# - the order does not have a valid email address
# - the update billing email is turned off for the account
# - a StoreFront communication flow handles unprocessed payments for the order (the flow emails the customer instead)
# - this method already sent the email for the order in the last 24 hours
#
# Requires SDK 4.1.260 or later.

order_api = OrderApi(api_client())

order_id = 'DEMO-0009104436'

try:
    api_response = order_api.send_update_billing_email(order_id)
except ApiException as e:
    # The reason for a refusal is in the response body.
    print(f"Exception when calling OrderApi->send_update_billing_email: {e}")
    exit()

if hasattr(api_response, 'error') and api_response.error is not None:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

if api_response.success:
    print('Update billing email was queued.')
