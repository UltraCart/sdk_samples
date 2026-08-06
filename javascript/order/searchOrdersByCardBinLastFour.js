import {orderApi} from '../api.js';

/**
 * Search orders by the card BIN (first six digits) plus the last four digits.
 *
 * A dispute or chargeback record from your gateway rarely carries the UltraCart order id, but it almost
 * always carries the card BIN, the last four digits, the transaction amount and the transaction date.
 * Matching on date + total + last four alone tends to return many orders, especially for subscription
 * merchants where rebills share the same amount. Adding the BIN pins the search to the specific card.
 *
 * Rules enforced by the API:
 *   - card_bin and card_last4 MUST be supplied together; neither works on its own.
 *   - card_bin is exactly 6 digits, card_last4 is exactly 4 digits (digits only).
 *   - ALWAYS send four digits in card_last4, including for American Express.
 *   - payment_date_begin AND payment_date_end are REQUIRED alongside the card fields.
 *   - The search is served from the cache; leave query_target unset (an explicit "origin" is rejected).
 *
 * A malformed card filter is a hard 400 rather than a silently ignored parameter, so you can never
 * mistake an unfiltered result set for a set of genuine card matches.
 *
 * The example values below are illustrative - substitute the BIN / last four / amount / dates from your
 * own gateway or chargeback record.
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
    const expansion = 'summary,payment,billing';

    // Search #1 - reconcile a dispute using the card and a payment date window.
    // Widen the window about a week on either side of the transaction date. That is inexpensive here because
    // the card is doing the real narrowing, and it absorbs any timezone difference between your gateway's
    // reporting and the payment timestamp recorded on the order.
    const query1 = {
        card_bin: '427162',
        card_last4: '6258',
        payment_date_begin: '2026-07-14T00:00:00+00:00',
        payment_date_end: '2026-07-28T23:59:59+00:00'
    };
    const response1 = await getOrdersByQuery(query1, {_limit: 200, _offset: 0, _expand: expansion});
    printMatches('Dispute reconciliation by card', response1);

    // Search #2 - add the transaction amount when you trust it.
    // Include total for extra precision. Leave it off when partial captures, surcharges or currency
    // conversion make an exact amount match unreliable.
    const query2 = {
        card_bin: '427162',
        card_last4: '6258',
        payment_date_begin: '2026-07-14T00:00:00+00:00',
        payment_date_end: '2026-07-28T23:59:59+00:00',
        total: 49.95
    };
    const response2 = await getOrdersByQuery(query2, {_limit: 200, _offset: 0, _expand: expansion});
    printMatches('Dispute reconciliation by card and amount', response2);

    // Search #3 - American Express. Still send FOUR digits in card_last4.
    // The API applies the AMEX specific reduction internally; do not send three digits.
    const query3 = {
        card_bin: '371234',
        card_last4: '5678',
        payment_date_begin: '2026-07-14T00:00:00+00:00',
        payment_date_end: '2026-07-28T23:59:59+00:00'
    };
    const response3 = await getOrdersByQuery(query3, {_limit: 200, _offset: 0, _expand: expansion});
    printMatches('American Express', response3);
}

execute().catch(console.error);
