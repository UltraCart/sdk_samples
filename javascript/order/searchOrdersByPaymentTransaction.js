import {orderApi} from '../api.js';

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

function printMatches(label, response) {
    const orders = response.orders ?? [];
    console.log(`${label}: ${orders.length} order(s) matched`);
    orders.forEach(order => console.log(`  ${order.order_id}`));
}

// The JavaScript SDK uses callbacks; wrap getOrdersByQuery in a promise for async/await.
function getOrdersByQuery(query, options) {
    return new Promise((resolve, reject) => {
        orderApi.getOrdersByQuery(query, options, (error, data) => error ? reject(error) : resolve(data));
    });
}

async function execute() {
    const expansion = 'summary,payment,payment.transaction';

    // Search #1 - reverse-lookup an order from a gateway transaction id.
    // The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
    const query1 = {
        query_target: 'cache', // transaction-detail search requires the cache
        payment_transaction_filters: [
            {name: 'rotatingTransactionGatewayCode', value: 'NMI'},
            {name: 'transactionid', value: '12244247793'}
        ]
        // Tip: to match a value under ANY detail name, omit name: {value: '12244247793'}
    };
    const response1 = await getOrdersByQuery(query1, {_limit: 200, _offset: 0, _expand: expansion});
    printMatches('Search by transaction id', response1);

    // Search #2 - reconcile a chargeback when you do not have the order id.
    // The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
    // transaction amount (total) and a payment date window to uniquely identify the order.
    const query2 = {
        query_target: 'cache',
        payment_transaction_filters: [{name: 'authcode', value: '100304'}],
        total: 77.00,
        payment_date_begin: '2026-06-29T00:00:00+00:00',
        payment_date_end: '2026-07-01T00:00:00+00:00'
    };
    const response2 = await getOrdersByQuery(query2, {_limit: 200, _offset: 0, _expand: expansion});
    printMatches('Chargeback reconciliation', response2);
}

execute().catch(console.error);
