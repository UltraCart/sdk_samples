from ultracart.apis import OrderApi
from ultracart.model.order_query import OrderQuery
from ultracart.model.order import Order
from ultracart.rest import ApiException
from pprint import pprint
from samples import api_client
from datetime import datetime, timedelta
import time

start_time = time.time()
api_instance = OrderApi(api_client())

## This example illustrates how to query the OrderQuery object to select a range of records.  It uses a subroutine
## to aggregate the records that span multiple API calls.  This specific example illustrates a work-around to selecting
## all rejected orders.  Because the UltraCart SDK does not have a way to query orders based on whether they
## were rejected, we can instead query based on the rejected_dts, which is null if the order is not rejected.
## So we will simply use a large time frame to ensure we query all rejections.

iteration = 1
offset = 0
limit = 1000
more_records_to_fetch = True
orders = []
date_field = 'payment'

def get_order_chunk():
    # expansion = "item,summary,billing,shipping,shipping.tracking_number_details"
    expansion = 'auto_order,billing,channel_partner,checkout,coupon,edi,gift,gift_certificate,internal,item,payment,payment.transaction,point_of_sale,properties,quote,shipping,shipping.tracking_number_details,summary,taxes,utms'
    ## see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
    ##
    ## Possible Order Expansions:
    ## affiliate           affiliate.ledger                    auto_order
    ## billing             channel_partner                     checkout
    ## coupon              customer_profile                    digital_order
    ## edi                 fraud_score                         gift
    ## gift_certificate    internal                            item
    ## linked_shipment     marketing                           payment
    ## payment.transaction quote                               salesforce
    ## shipping            shipping.tracking_number_details    summary
    ## taxes
    ##

    query = OrderQuery()
    ## Uncomment the next line to retrieve a single order.  But there are simpler methods to retrieve a single order than getOrdersByQuery
    ## order_query.order_id = "DEMO-0009104390"

    now = datetime.now()
    six_hours_ago = now - timedelta(hours=6)
    # begin_dts = datetime.strptime('2000-01-01', '%Y-%m-%d').astimezone().isoformat('T', 'milliseconds')
    begin_dts = six_hours_ago.astimezone().isoformat('T', 'milliseconds')

    end_dts = datetime.now().astimezone().isoformat('T', 'milliseconds')
    print(f"Date range: {begin_dts} to {end_dts}")

    if date_field == 'reject':
        query.refund_date_begin = begin_dts
        query.refund_date_end = end_dts
    elif date_field == 'shipment':
        query.shipment_date_begin = begin_dts
        query.shipment_date_end = end_dts
    else:
        query.payment_date_begin = begin_dts
        query.payment_date_end = end_dts

    query.query_target = 'cache'  # cache is much faster, but may be missing the last few minutes of orders.

    api_response = api_instance.get_orders_by_query(order_query=query, limit=limit, offset=offset, expand=expansion, sort='+shipping.state_region,-shipping.city')
    if api_response.orders is not None:
        return api_response.orders
    return []


while more_records_to_fetch:
    print(f"executing iteration {iteration} ")
    chunk_of_orders = get_order_chunk()
    orders.extend(chunk_of_orders)
    offset = offset + limit
    more_records_to_fetch = len(chunk_of_orders) == limit
    iteration = iteration + 1

# pprint(orders)
for order in orders:
    shipping = getattr(order, 'shipping')
    # pprint(shipping)
    print(f"{getattr(shipping, 'state_region', 'NULL')} {getattr(shipping, 'city', 'NULL')} {order.order_id}")
    # pprint(order)
print(f"{len(orders)} were returned.")

# pprint(orders[0])

end_time = time.time()
elapsed_time = end_time - start_time
print(f"The {date_field} date range query took {elapsed_time} seconds to execute.")