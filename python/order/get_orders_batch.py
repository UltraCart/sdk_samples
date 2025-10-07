from ultracart.apis import OrderApi
from ultracart.model.order_query_batch import OrderQueryBatch
from pprint import pprint
from samples import api_client

api_instance = OrderApi(api_client())

## This example shows how to request up to 500 orders by passing in their order ids.

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

order_batch = OrderQueryBatch()
order_batch.limit = 500
order_batch.limit = 500
order_batch.query_target = "cache"
order_batch.order_ids = [
    'DEMO-0009103110',
    'DEMO-0009103116',
    'DEMO-0009103121',
    'DEMO-0009103416',
    'DEMO-0009103422',
    'DEMO-0009103423',
    'DEMO-0009103424',
    'DEMO-0009103426',
    'DEMO-0009103427'
]

api_response = api_instance.get_orders_batch(order_batch=order_batch, expand=expansion)
orders = api_response.orders

pprint(orders)
for order in orders:
    pprint(order)
print(f"{len(orders)} were returned.")