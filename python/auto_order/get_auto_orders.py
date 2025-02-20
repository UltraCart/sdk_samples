from ultracart.apis import AutoOrderApi
from samples import api_client

# getAutoOrders provides a query service on AutoOrders (aka subscriptions or recurring orders) within the UltraCart
# system. It was the first query provided and the most cumbersome to use.  Please use getAutoOrdersByQuery for an
# easier query method.  If you have multiple auto_order_oids and need the corresponding objects, consider
# getAutoOrdersBatch() to reduce call count.

def get_auto_order_chunk(auto_order_api, offset, limit):
    expand = "items,original_order,rebill_orders"
    # see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
    """
    Possible Order Expansions:

    add_ons                             items.sample_schedule	        original_order.buysafe	        original_order.payment.transaction
    items	                            original_order	                original_order.channel_partner	original_order.quote
    items.future_schedules	            original_order.affiliate	    original_order.checkout	        original_order.salesforce
    original_order.affiliate.ledger	    original_order.coupon	        original_order.shipping
    original_order.auto_order	        original_order.customer_profile	original_order.summary
    original_order.billing	            original_order.digital_order	original_order.taxes
    rebill_orders	                    original_order.edi	            rebill_orders.affiliate
    rebill_orders.affiliate.ledger	    original_order.fraud_score	    rebill_orders.auto_order
    rebill_orders.billing	            original_order.gift	            rebill_orders.buysafe
    rebill_orders.channel_partner	    original_order.gift_certificate	rebill_orders.checkout
    rebill_orders.coupon	            original_order.internal	        rebill_orders.customer_profile
    rebill_orders.digital_order	        original_order.item	            rebill_orders.edi
    rebill_orders.fraud_score	        original_order.linked_shipment	rebill_orders.gift
    rebill_orders.gift_certificate      original_order.marketing	    rebill_orders.internal
    rebill_orders.item	                original_order.payment	        rebill_orders.linked_shipment
    rebill_orders.marketing	            rebill_orders.payment	        rebill_orders.quote
    rebill_orders.payment.transaction	rebill_orders.salesforce	    rebill_orders.shipping
    rebill_orders.summary	            rebill_orders.taxes
    """

    auto_order_code = None
    original_order_id = None
    first_name = None
    last_name = None
    company = None
    city = None
    state = None
    postal_code = None
    country_code = None
    phone = None
    email = 'test@ultracart.com'  # <-- for this example, we are only filtering on email address.
    original_order_date_begin = None
    original_order_date_end = None
    next_shipment_date_begin = None
    next_shipment_date_end = None
    card_type = None
    item_id = None
    status = None
    since = None
    sort = None

    # see all these parameters?  that is why you should use getAutoOrdersByQuery() instead of getAutoOrders()
    api_response = auto_order_api.get_auto_orders(auto_order_code, original_order_id, first_name, last_name,
        company, city, state, postal_code, country_code, phone, email, original_order_date_begin,
        original_order_date_end, next_shipment_date_begin, next_shipment_date_end, card_type, item_id, status,
        limit, offset, since, sort, expand=expand)

    if api_response.auto_orders is not None:
        return api_response.auto_orders
    return []

def get_all_auto_orders():
    auto_order_api = AutoOrderApi(api_client())
    auto_orders = []

    iteration = 1
    offset = 0
    limit = 200
    more_records_to_fetch = True

    while more_records_to_fetch:
        print(f"executing iteration {iteration}")
        chunk_of_auto_orders = get_auto_order_chunk(auto_order_api, offset, limit)
        auto_orders.extend(chunk_of_auto_orders)
        offset = offset + limit
        more_records_to_fetch = len(chunk_of_auto_orders) == limit
        iteration += 1

    # this could get verbose...
    print(auto_orders)

if __name__ == "__main__":
    get_all_auto_orders()