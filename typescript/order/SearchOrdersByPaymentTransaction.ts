import {orderApi} from '../api';
import {
    OrderQuery,
    OrdersResponse,
    Order
} from 'ultracart_rest_api_v2_typescript';

/**
 * Search orders by the key/value pairs recorded on a payment transaction.
 *
 * Each payment transaction stores the gateway's response as a set of name/value detail pairs
 * (payment.transactions[].details[], e.g. authcode, transactionid, rotatingTransactionGatewayCode).
 * The payment_transaction_filters field on the order query matches against those pairs, letting you
 * reverse-lookup an order from a gateway/processor transaction id, or reconcile a chargeback.
 *
 * Rules enforced by the API:
 *   - query_target MUST be "cache" (ElasticSearch); the database path cannot search transaction details.
 *   - Each filter value is REQUIRED and matched EXACTLY (no wildcards).
 *   - A filter name is OPTIONAL; omit it to match the value across any detail name.
 *   - Multiple filters are AND-ed against the SAME transaction (the rotating gateway is just another pair).
 *   - At most 10 filters are allowed.
 *
 * The example values below are illustrative - substitute the transaction id / auth code / amount / dates
 * from your own gateway or chargeback record.
 */

function printMatches(label: string, response: OrdersResponse): void {
    const orders: Order[] = response.orders ?? [];
    console.log(`${label}: ${orders.length} order(s) matched`);
    orders.forEach(order => console.log(`  ${order.order_id}`));
}

async function execute(): Promise<void> {
    const expansion = 'summary,payment,payment.transaction';

    // Search #1 - reverse-lookup an order from a gateway transaction id.
    // The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
    const query1: OrderQuery = {
        query_target: 'cache', // transaction-detail search requires the cache
        payment_transaction_filters: [
            {name: 'rotatingTransactionGatewayCode', value: 'NMI'},
            {name: 'transactionid', value: '12244247793'}
        ]
        // Tip: to match a value under ANY detail name, omit name: {value: '12244247793'}
    };
    const response1: OrdersResponse = await orderApi.getOrdersByQuery({
        orderQuery: query1,
        limit: 200,
        offset: 0,
        expand: expansion
    });
    printMatches('Search by transaction id', response1);

    // Search #2 - reconcile a chargeback when you do not have the order id.
    // The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
    // transaction amount (total) and a payment date window to uniquely identify the order.
    const query2: OrderQuery = {
        query_target: 'cache',
        payment_transaction_filters: [{name: 'authcode', value: '100304'}],
        total: 77.00,
        payment_date_begin: '2026-06-29T00:00:00+00:00',
        payment_date_end: '2026-07-01T00:00:00+00:00'
    };
    const response2: OrdersResponse = await orderApi.getOrdersByQuery({
        orderQuery: query2,
        limit: 200,
        offset: 0,
        expand: expansion
    });
    printMatches('Chargeback reconciliation', response2);
}

execute().catch(console.error);
