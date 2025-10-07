import time
from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# Increase time limit, pulling all orders could take a long time.
time_limit = 3
# Set display errors
display_errors = 1

# getOrders was the first order query provided by UltraCart. It still functions well, but it is extremely verbose
# because the query call takes a variable for every possible filter. You are advised to use getOrdersByQuery().
# It is easier to use and will result in less code. Still, we provide an example here to be thorough.
#
# For this email, we will query all orders for a particular email address. The getOrdersByQuery() example
# illustrates using a date range to filter and select orders.

# Using the API key to initialize the order API
order_api = OrderApi(api_client())

def get_order_chunk(order_api, offset, limit):
    expand = "item,summary,billing,shipping,shipping.tracking_number_details"
    # See www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
    # Possible Order Expansions:
    # affiliate           affiliate.ledger                    auto_order
    # billing             channel_partner                     checkout
    # coupon              customer_profile                    digital_order
    # edi                 fraud_score                         gift
    # gift_certificate    internal                            item
    # linked_shipment     marketing                           payment
    # payment.transaction quote                               salesforce
    # shipping            shipping.tracking_number_details    summary
    # taxes

    # Set max execution time
    time.sleep(time_limit)

    # order_id = ''
    # payment_method = ''
    # company = ''
    # first_name = ''
    # last_name = ''
    # city = ''
    # state_region = ''
    # postal_code = ''
    # country_code = ''
    # phone = ''
    email = 'support@ultracart.com'  # <-- this is the only filter we're using.
    # cc_email = ''
    # total = 0
    # screen_branding_theme_code = ''
    # storefront_host_name = ''
    # creation_date_begin = 'iso8601 format'
    # creation_date_end = 'iso8601 format'
    # payment_date_begin = 'iso8601 format'
    # payment_date_end = 'iso8601 format'
    # shipment_date_begin = 'iso8601 format'
    # shipment_date_end = 'iso8601 format'
    # rma = ''
    # purchase_order_number = ''
    # item_id = ''
    # current_stage = 'Completed'
    # channel_partner_code = ''
    # channel_partner_order_id = ''
    # sort = ''

    # See all these parameters? That is why you should use getOrdersByQuery() instead of getOrders()
    try:
        api_response = order_api.get_orders(
            # order_id=order_id,
            # payment_method=payment_method,
            # company=company,
            # first_name=first_name,
            # last_name=last_name,
            # city=city,
            # state_region=state_region,
            # postal_code=postal_code,
            # country_code=country_code,
            # phone=phone,
            email=email,
            # cc_email=cc_email,
            # total=total,
            # screen_branding_theme_code=screen_branding_theme_code,
            # storefront_host_name=storefront_host_name,
            # creation_date_begin=creation_date_begin,
            # creation_date_end=creation_date_end,
            # payment_date_begin=payment_date_begin,
            # payment_date_end=payment_date_end,
            # shipment_date_begin=shipment_date_begin,
            # shipment_date_end=shipment_date_end,
            # rma=rma,
            # purchase_order_number=purchase_order_number,
            # item_id=item_id,
            # current_stage=current_stage,
            # channel_partner_code=channel_partner_code,
            # channel_partner_order_id=channel_partner_order_id,
            limit=limit,
            offset=offset,
            # sort=sort,
            expand=expand
        )
    except ApiException as e:
        print(f"Exception when calling OrderApi->get_orders: {e}")
        return []

    if api_response.orders is not None:
        return api_response.orders
    return []

# Initialize empty list to hold orders
orders = []

iteration = 1
offset = 0
limit = 200
more_records_to_fetch = True

while more_records_to_fetch:
    print(f"executing iteration {iteration}")
    chunk_of_orders = get_order_chunk(order_api, offset, limit)
    orders.extend(chunk_of_orders)
    offset += limit
    more_records_to_fetch = len(chunk_of_orders) == limit
    iteration += 1

# This could get verbose...
import pprint
pprint.pprint(orders)
