import { orderApi } from '../api.js';

/**
 * getOrders was the first order query provided by UltraCart. It still functions well, but it is extremely verbose
 * because the query call takes a variable for every possible filter. You are advised to get getOrdersByQuery().
 * It is easier to use and will result in less code. Still, we provide an example here to be thorough.
 *
 * For this email, we will query all orders for a particular email address. The getOrdersByQuery() example
 * illustrates using a date range to filter and select orders.
 */
export async function execute() {
    const orders = [];

    let iteration = 1;
    let offset = 0;
    const limit = 200;
    let moreRecordsToFetch = true;

    while (moreRecordsToFetch) {
        console.log(`executing iteration ${iteration}<br>`);
        const chunkOfOrders = await getOrderChunk(offset, limit);
        orders.push(...chunkOfOrders);
        offset = offset + limit;
        moreRecordsToFetch = chunkOfOrders.length === limit;
        iteration++;
    }

    // this could get verbose...
    for (const order of orders) {
        console.log(JSON.stringify(order, null, 2));
    }

    console.log(orders);
}

/**
 * Fetches a chunk of orders based on various filters
 * @param offset - The offset for pagination
 * @param limit - The number of records to fetch
 * @returns A list of orders
 */
async function getOrderChunk(offset, limit) {
    // The expansion variable instructs UltraCart how much information to return.
    // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
    /*
    Possible Order Expansions:
    affiliate           affiliate.ledger                    auto_order
    billing             channel_partner                     checkout
    coupon              customer_profile                    digital_order
    edi                 fraud_score                         gift
    gift_certificate    internal                            item
    linked_shipment     marketing                           payment
    payment.transaction quote                               salesforce
    shipping            shipping.tracking_number_details    summary
    taxes
    */
    const expansion = "item,summary,billing,shipping,shipping.tracking_number_details";

    // Prepare query parameters - only using email as a filter
    const queryParams = {
        order_id: undefined,
        payment_method: undefined,
        company: undefined,
        first_name: undefined,
        last_name: undefined,
        city: undefined,
        state_region: undefined,
        postal_code: undefined,
        country_code: undefined,
        phone: undefined,
        email: "support@ultracart.com", // <-- this is the only filter we're using
        cc_email: undefined,
        total: undefined,
        screen_branding_theme_code: undefined,
        storefront_host_name: undefined,
        creation_date_begin: undefined,
        creation_date_end: undefined,
        payment_date_begin: undefined,
        payment_date_end: undefined,
        shipment_date_begin: undefined,
        shipment_date_end: undefined,
        rma: undefined,
        purchase_order_number: undefined,
        item_id: undefined,
        current_stage: undefined,
        channel_partner_code: undefined,
        channel_partner_order_id: undefined,
        _limit: limit,
        _offset: offset,
        _sort: undefined,
        _expand: expansion
    };

    try {
        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.getOrders(queryParams, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        return apiResponse.orders || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}