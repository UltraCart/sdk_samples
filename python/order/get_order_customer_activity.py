from ultracart.apis import OrderApi
from samples import api_client

# get_order_customer_activity() returns the customer activity associated with the email address on an
# order.  This includes email engagement history, email list and segment membership, lifetime metrics and
# email suppression status.
#
# A customer profile is NOT required and is not consulted.  The activity is keyed off the email address on
# the order, so this works for guest orders that have never had a customer profile established.  For the
# page views captured during the session that placed the order, use get_order_page_view_history() instead.
#
# If the order has no valid email address, email and customer_activity both come back None.  That is a
# successful response rather than an error - without an email there is no activity record to find.
#
# Note: activity.ts is a unix timestamp in milliseconds, not an ISO 8601 string like most dates in this API.
#
# Possible Errors:
# order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."

# Create Order API instance
order_api = OrderApi(api_client())

# Order ID to retrieve customer activity for
order_id = "DEMO-0009104976"

# Retrieve customer activity
response = order_api.get_order_customer_activity(order_id)

print("Customer activity for: {}".format(response.email))

customer_activity = response.customer_activity

if customer_activity is None:
    print("No customer activity found for this order.")
else:
    print("Globally unsubscribed: {}".format(customer_activity.global_unsubscribed))
    print("Spam complaint: {}".format(customer_activity.spam_complaint))

    # Print the activity history
    for activity in customer_activity.activities or []:
        print(activity)
