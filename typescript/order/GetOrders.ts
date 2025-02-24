import { orderApi } from '../api';
import {
    Order,
    OrdersResponse
} from 'ultracart_rest_api_v2_typescript';

/**
 * getOrders was the first order query provided by UltraCart. It still functions well, but it is extremely verbose
 * because the query call takes a variable for every possible filter. You are advised to get getOrdersByQuery().
 * It is easier to use and will result in less code. Still, we provide an example here to be thorough.
 *
 * For this email, we will query all orders for a particular email address. The getOrdersByQuery() example
 * illustrates using a date range to filter and select orders.
 */
export async function execute(): Promise<void> {
    const orders: Order[] = [];

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

    console.log("<html lang=\"en\"><body><pre>");
    console.log(orders);
    console.log("</pre></body></html>");
}

/**
 * Fetches a chunk of orders based on various filters
 * @param offset - The offset for pagination
 * @param limit - The number of records to fetch
 * @returns A list of orders
 */
async function getOrderChunk(offset: number, limit: number): Promise<Order[]> {
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
        orderId: undefined,
        paymentMethod: undefined,
        company: undefined,
        firstName: undefined,
        lastName: undefined,
        city: undefined,
        stateRegion: undefined,
        postalCode: undefined,
        countryCode: undefined,
        phone: undefined,
        email: "support@ultracart.com", // <-- this is the only filter we're using
        ccEmail: undefined,
        total: undefined,
        screenBrandingThemeCode: undefined,
        storefrontHostName: undefined,
        creationDateBegin: undefined,
        creationDateEnd: undefined,
        paymentDateBegin: undefined,
        paymentDateEnd: undefined,
        shipmentDateBegin: undefined,
        shipmentDateEnd: undefined,
        rma: undefined,
        purchaseOrderNumber: undefined,
        itemId: undefined,
        currentStage: undefined,
        channelPartnerCode: undefined,
        channelPartnerOrderId: undefined,
        limit,
        offset,
        sort: undefined,
        expand: expansion
    };

    try {
        const apiResponse: OrdersResponse = await orderApi.getOrders(queryParams);
        return apiResponse.orders || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}