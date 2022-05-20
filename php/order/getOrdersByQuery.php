<?php

set_time_limit(3000); // pull all orders could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to query the OrderQuery object to select a range of records.  It uses a subroutine
 * to aggregate the records that span multiple API calls.  This example illustrates a work-around to selecting
 * all rejected orders.  Because the UltraCart SDK does not have a way to query orders based on whether they
 * were rejected, we can instead query based on the rejected_dts, which is null if the order is not rejected.
 * So we will simply use a large time frame to ensure we query all rejections.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderQuery;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = ultracart\v2\api\OrderApi::usingApiKey(Constants::API_KEY);


function getOrderChunk(OrderApi $order_api, int $offset, int $limit): array
{
    $expansion = "item,summary,billing,shipping,shipping.tracking_number_details";
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

    $query = new OrderQuery();
    // Uncomment the next two lines to retrieve a single order.  But there are simpler methods to do that.
    // $order_id = "DEMO-0009104390";
    // $order_query->setOrderId($order_id);

    $begin_dts = date('Y-m-d', strtotime('-2000 days')) . "T00:00:00+00:00"; // yes, that 2,000 days.
    $end_dts = date('Y-m-d', time()) . "T00:00:00+00:00";
    error_log($begin_dts);
    error_log($end_dts);

    $query->setRefundDateBegin($begin_dts);
    $query->setRefundDateEnd($end_dts);

    $api_response = $order_api->getOrdersByQuery($query, $limit, $offset, null, $expansion);
    if($api_response->getOrders() != null){
        return $api_response->getOrders();
    }
    return [];
}

$orders = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

while( $more_records_to_fetch ){

    echo "executing iteration " . $iteration . '<br>';
    $chunk_of_orders = getOrderChunk($order_api, $offset, $limit);
    $orders = array_merge($orders, $chunk_of_orders);
    $offset = $offset + $limit;
    $more_records_to_fetch = count($chunk_of_orders) == $limit;
    $iteration++;

}

// this could get verbose...
echo '<html lang="en"><body><pre>';
var_dump($orders);
echo '</pre></body></html>';
