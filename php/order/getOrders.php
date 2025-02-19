<?php

set_time_limit(3000); // pull all orders could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * getOrders was the first order query provided by UltraCart.  It still functions well, but it is extremely verbose
 * because the query call takes a variable for every possible filter.  You are advised to get getOrdersByQuery().
 * It is easier to use and will result in less code.  Still, we provide an example here to be thorough.
 *
 * For this email, we will query all orders for a particular email address.  The getOrdersByQuery() example
 * illustrates using a date range to filter and select orders.
 */

use ultracart\v2\api\OrderApi;

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

    $order_id = null;
    $payment_method = null;
    $company = null;
    $first_name = null;
    $last_name = null;
    $city = null;
    $state_region = null;
    $postal_code = null;
    $country_code = null;
    $phone = null;
    $email = 'support@ultracart.com'; // <-- this is the only filter we're using.
    $cc_email = null;
    $total = null;
    $screen_branding_theme_code = null;
    $storefront_host_name = null;
    $creation_date_begin = null;
    $creation_date_end = null;
    $payment_date_begin = null;
    $payment_date_end = null;
    $shipment_date_begin = null;
    $shipment_date_end = null;
    $rma = null;
    $purchase_order_number = null;
    $item_id = null;
    $current_stage = null;
    $channel_partner_code = null;
    $channel_partner_order_id = null;
    $_sort = null;


    // see all these parameters?  that is why you should use getOrdersByQuery() instead of getOrders()
    $api_response = $order_api->getOrders($order_id, $payment_method, $company, $first_name, $last_name, $city,
        $state_region, $postal_code, $country_code, $phone, $email, $cc_email, $total, $screen_branding_theme_code,
        $storefront_host_name, $creation_date_begin, $creation_date_end, $payment_date_begin, $payment_date_end,
        $shipment_date_begin, $shipment_date_end, $rma, $purchase_order_number, $item_id, $current_stage,
        $channel_partner_code, $channel_partner_order_id, $limit, $offset, $_sort, $expansion);

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
