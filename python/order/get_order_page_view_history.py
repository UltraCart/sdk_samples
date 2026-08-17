from ultracart.apis import OrderApi
from samples import api_client

# get_order_page_view_history() returns the page views captured during the session that placed an order,
# along with the referrer that started that session.
#
# A customer profile is NOT required.  These page views are keyed off an analytics client id stored on the
# order itself, so this works for guest orders.  For the email engagement side of customer activity, use
# get_order_customer_activity() instead.
#
# An order placed outside the storefront, such as a phone order or an order imported from a channel
# partner, will have no analytics session attached.  In that case page_views comes back empty.  That is a
# successful response rather than an error.
#
# Note: view_dts is an ISO 8601 string here.  Be aware that the ts field on get_order_customer_activity()
# is unix milliseconds instead, so do not assume the two methods format dates the same way.
#
# Possible Errors:
# order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."

# Create Order API instance
order_api = OrderApi(api_client())

# Order ID to retrieve page view history for
order_id = "DEMO-0009104976"

# Retrieve page view history
response = order_api.get_order_page_view_history(order_id)

print("Session referrer: {}".format(response.referrer or "(none captured)"))

page_views = response.page_views or []

if not page_views:
    print("No page views were captured for this order.")
else:
    for page_view in page_views:
        time_on_page = " ({}s on page)".format(page_view.time_on_page) if page_view.time_on_page else ""
        print("{} - {}{}".format(page_view.view_dts, page_view.url, time_on_page))

        for param in page_view.params or []:
            print("    param {} = {}".format(param.name, param.value))

        for meta in page_view.meta_data or []:
            print("    meta  {} = {}".format(meta.name, meta.value))
