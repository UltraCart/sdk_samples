import time
from ultracart import ApiException
from ultracart.apis import OrderApi
from samples import api_client

# Increase time limit, pulling all orders could take a long time.
time_limit = 3000
# Set max execution time
time.sleep(time_limit)
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

    order_id = None
    payment_method = None
    company = None
    first_name = None
    last_name = None
    city = None
    state_region = None
    postal_code = None
    country_code = None
    phone = None
    email = 'support@ultracart.com'  # <-- this is the only filter we're using.
    cc_email = None
    total = None
    screen_branding_theme_code = None
    storefront_host_name = None
    creation_date_begin = None
    creation_date_end = None
    payment_date_begin = None
    payment_date_end = None
    shipment_date_begin = None
    shipment_date_end = None
    rma = None
    purchase_order_number = None
    item_id = None
    current_stage = None
    channel_partner_code = None
    channel_partner_order_id = None
    _sort = None

    # See all these parameters? That is why you should use getOrdersByQuery() instead of getOrders()
    try:
        api_response = order_api.get_orders(
            order_id=order_id, payment_method=payment_method, company=company, first_name=first_name,
            last_name=last_name, city=city, state_region=state_region, postal_code=postal_code,
            country_code=country_code, phone=phone, email=email, cc_email=cc_email, total=total,
            screen_branding_theme_code=screen_branding_theme_code, storefront_host_name=storefront_host_name,
            creation_date_begin=creation_date_begin, creation_date_end=creation_date_end,
            payment_date_begin=payment_date_begin, payment_date_end=payment_date_end,
            shipment_date_begin=shipment_date_begin, shipment_date_end=shipment_date_end, rma=rma,
            purchase_order_number=purchase_order_number, item_id=item_id, current_stage=current_stage,
            channel_partner_code=channel_partner_code, channel_partner_order_id=channel_partner_order_id,
            limit=limit, offset=offset, _sort=_sort, expand=expand
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
