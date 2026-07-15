<?php

/*
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

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderQuery;
use ultracart\v2\models\OrderQueryPaymentTransactionFilter;

require_once '../vendor/autoload.php';
require_once '../constants.php';

$order_api = OrderApi::usingApiKey(Constants::API_KEY);
$expansion = 'summary,payment,payment.transaction';

function print_matches(string $label, $api_response): void
{
    $orders = $api_response->getOrders() ?? [];
    echo $label . ': ' . count($orders) . " order(s) matched\n";
    foreach ($orders as $order) {
        echo '  ' . $order->getOrderId() . "\n";
    }
}

// Search #1 - reverse-lookup an order from a gateway transaction id.
// The two filters are AND-ed against the SAME transaction: the rotating gateway code AND the gateway transaction id.
$query = new OrderQuery();
$query->setQueryTarget('cache'); // transaction-detail search requires the cache
$query->setPaymentTransactionFilters([
    new OrderQueryPaymentTransactionFilter(['name' => 'rotatingTransactionGatewayCode', 'value' => 'NMI']),
    new OrderQueryPaymentTransactionFilter(['name' => 'transactionid', 'value' => '12244247793']),
]);
// Tip: to match a value under ANY detail name, omit name:
//   new OrderQueryPaymentTransactionFilter(['value' => '12244247793'])
$response = $order_api->getOrdersByQuery($query, 200, 0, null, $expansion);
print_matches('Search by transaction id', $response);

// Search #2 - reconcile a chargeback when you do not have the order id.
// The auth code from the chargeback file is stored as the "authcode" detail; combine it with the
// transaction amount (total) and a payment date window to uniquely identify the order.
$query = new OrderQuery();
$query->setQueryTarget('cache');
$query->setPaymentTransactionFilters([
    new OrderQueryPaymentTransactionFilter(['name' => 'authcode', 'value' => '100304']),
]);
$query->setTotal(77.00);
$query->setPaymentDateBegin('2026-06-29T00:00:00+00:00');
$query->setPaymentDateEnd('2026-07-01T00:00:00+00:00');
$response = $order_api->getOrdersByQuery($query, 200, 0, null, $expansion);
print_matches('Chargeback reconciliation', $response);
