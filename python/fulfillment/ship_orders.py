from ultracart.apis import FulfillmentApi
from ultracart.models import FulfillmentShipment
from samples import api_client
from ultracart.rest import ApiException

"""
shipOrders informs UltraCart that you (the fulfillment center) have shipped an order and allows you to provide
UltraCart with tracking information.

You will need the distribution center (DC) code. UltraCart allows for multiple DC and the code is a
unique short string you assign to a DC as an easy mnemonic.

For more information about UltraCart distribution centers, please see:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

If you do not know your DC code, query a list of all DC and print them out:
result = fulfillment_api.get_distribution_centers()
print(result)

A successful call will receive back a status code 204 (No Content).

Possible Errors:
More than 100 order ids provided -> "shipments can not contain more than 100 records at a time"
"""

fulfillment_api = FulfillmentApi(api_client())
distribution_center_code = 'RAMI'

shipment = FulfillmentShipment()
shipment.set_order_id('DEMO-12345')
shipment.set_tracking_numbers(['UPS-1234567890', 'USPS-BLAH-BLAH-BLAH'])  # this order had two boxes
shipment.set_shipping_cost(16.99)  # the actual cost to ship this order
shipment.set_fulfillment_fee(8.99)  # this fulfillment center is kinda pricey
shipment.set_package_cost(11.99)  # 11.99? we use only the finest packaging

shipments = [shipment]  # up to 100 shipments per call

try:
    # limit is 100 shipments updates at a time
    fulfillment_api.ship_orders(distribution_center_code, shipments)
    print("done")
except ApiException as e:
    # update inventory failed. examine the reason.
    print(f'Exception when calling FulfillmentApi->ship_orders: {e}')
    exit(1)