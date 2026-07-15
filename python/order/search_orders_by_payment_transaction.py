# Search orders by the key/value pairs recorded on a payment transaction.
#
# Each payment transaction stores the gateway's response as a set of name/value detail pairs
# (payment.transactions[].details[], e.g. authcode, transactionid, rotatingTransactionGatewayCode).
# The payment_transaction_filters field on the order query matches against those pairs, letting you
# reverse-lookup an order from a gateway/processor transaction id, or reconcile a chargeback.
#
# Rules enforced by the API:
#   - query_target MUST be "cache" (ElasticSearch); the database path cannot search transaction details.
#   - Each filter value is REQUIRED and matched EXACTLY (no wildcards).
#   - A filter name is OPTIONAL; omit it to match the value across any detail name.
#   - Multiple filters are AND-ed against the SAME transaction (the rotating gateway is just another pair).
#   - At most 10 filters are allowed.
#
# The example values below are illustrative - substitute the transaction id / auth code / amount / dates
# from your own gateway or chargeback record.

from ultracart.apis import OrderApi
from ultracart.model.order_query import OrderQuery
from ultracart.model.order_query_payment_transaction_filter import OrderQueryPaymentTransactionFilter
from ultracart.rest import ApiException
from samples import api_client

api_instance = OrderApi(api_client())
expansion = 'summary,payment,payment.transaction'


def print_matches(label, api_response):
    orders = api_response.orders or []
    print(f"{label}: {len(orders)} order(s) matched")
    for order in orders:
        print(f"  {order.order_id}")


# Search #1 - reverse-lookup an order from a gateway transaction id.
# The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
try:
    query = OrderQuery(
        query_target='cache',  # transaction-detail search requires the cache
        payment_transaction_filters=[
            OrderQueryPaymentTransactionFilter(name='rotatingTransactionGatewayCode', value='NMI'),
            OrderQueryPaymentTransactionFilter(name='transactionid', value='12244247793'),
        ],
    )
    # Tip: to match a value under ANY detail name, omit name:
    #   OrderQueryPaymentTransactionFilter(value='12244247793')
    response = api_instance.get_orders_by_query(order_query=query, limit=200, offset=0, expand=expansion)
    print_matches('Search by transaction id', response)
except ApiException as e:
    print("Exception when calling OrderApi->get_orders_by_query: %s\n" % e)


# Search #2 - reconcile a chargeback when you do not have the order id.
# The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
# transaction amount (total) and a payment date window to uniquely identify the order.
try:
    query = OrderQuery(
        query_target='cache',
        payment_transaction_filters=[
            OrderQueryPaymentTransactionFilter(name='authcode', value='100304'),
        ],
        total=77.00,
        payment_date_begin='2026-06-29T00:00:00+00:00',
        payment_date_end='2026-07-01T00:00:00+00:00',
    )
    response = api_instance.get_orders_by_query(order_query=query, limit=200, offset=0, expand=expansion)
    print_matches('Chargeback reconciliation', response)
except ApiException as e:
    print("Exception when calling OrderApi->get_orders_by_query: %s\n" % e)
