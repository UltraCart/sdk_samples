from ultracart.apis import OrderApi
from samples import api_client

# get_order_edi_documents() returns all EDI documents associated with an order.
#
# Possible Errors:
# Order.channel_partner_oid is null -> "Order is not associated with an EDI channel partner."

# Create Order API instance
order_api = OrderApi(api_client())

# Order ID to retrieve EDI documents for
order_id = "DEMO-0009104976"

# Retrieve EDI documents
edi_documents = order_api.get_order_edi_documents(order_id).edi_documents

# Print EDI documents
print(edi_documents)
