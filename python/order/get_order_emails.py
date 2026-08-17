from ultracart.apis import OrderApi
from samples import api_client

# get_order_emails() returns the delivery records for every email UltraCart sent regarding an order,
# oldest first.  Each record carries the subject and send time plus delivery, open, click and bounce
# status, which makes this useful evidence that a customer was notified about their order.
#
# A customer profile is NOT required.  These records are tied to the order id itself.
#
# An order with no email history, or one whose emails were all suppressed, comes back with an empty emails
# list.  That is a successful response rather than an error.
#
# The internal flag marks messages sent to merchant staff rather than to the customer.  Filter those out
# if you only want what the customer actually received.
#
# Possible Errors:
# order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."

# Create Order API instance
order_api = OrderApi(api_client())

# Order ID to retrieve email delivery information for
order_id = "DEMO-0009104976"

# Retrieve the emails sent for this order
emails = order_api.get_order_emails(order_id).emails or []

if not emails:
    print("No emails were sent for this order.")
else:
    for email in emails:
        print("{} - {} - {}".format(email.send_dts, email.email, email.subject))

        status = []
        if email.delivered:
            status.append("delivered {}".format(email.delivery_dts))
        if email.opened:
            status.append("opened {}".format(email.opened_dts))
        if email.clicked:
            status.append("clicked {}".format(email.clicked_dts))
        if email.skipped:
            status.append("skipped: {}".format(email.skip_reason))
        if email.bounce_type:
            status.append("bounced {}/{}".format(email.bounce_type, email.bounce_sub_type))

        print("    {}".format(", ".join(status) if status else "no delivery events recorded"))
