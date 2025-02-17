<?php

use ultracart\v2\api\AutoOrderApi;

set_time_limit(3000); // pull all orders could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*

getAutoOrders provides a query service on AutoOrders (aka subscriptions or recurring orders) within the UltraCart
system. It was the first query provided and the most cumbersome to use.  Please use getAutoOrdersByQuery for an
easier query method.  If you have multiple auto_order_oids and need the corresponding objects, consider
getAutoOrdersBatch() to reduce call count.

*/


require_once '../vendor/autoload.php';
require_once '../constants.php';


$auto_order_api = AutoOrderApi::usingApiKey(Constants::API_KEY);


function getAutoOrderChunk(AutoOrderApi $auto_order_api, int $_offset, int $_limit): array
{
    $_expand = "items,original_order,rebill_orders";
    // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
    /*
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

    */

    $auto_order_code = null;
    $original_order_id = null;
    $first_name = null;
    $last_name = null;
    $company = null;
    $city = null;
    $state = null;
    $postal_code = null;
    $country_code = null;
    $phone = null;
    $email = 'test@ultracart.com'; // <-- for this example, we are only filtering on email address.
    $original_order_date_begin = null;
    $original_order_date_end = null;
    $next_shipment_date_begin = null;
    $next_shipment_date_end = null;
    $card_type = null;
    $item_id = null;
    $status = null;
    $_since = null;
    $_sort = null;



    // see all these parameters?  that is why you should use getAutoOrdersByQuery() instead of getAutoOrders()
    $api_response = $auto_order_api->getAutoOrders($auto_order_code, $original_order_id, $first_name, $last_name,
        $company, $city, $state, $postal_code, $country_code, $phone, $email, $original_order_date_begin,
        $original_order_date_end, $next_shipment_date_begin, $next_shipment_date_end, $card_type, $item_id, $status,
        $_limit, $_offset, $_since, $_sort, $_expand);

    if($api_response->getAutoOrders() != null){
        return $api_response->getAutoOrders();
    }
    return [];
}

$auto_orders = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

while( $more_records_to_fetch ){

    echo "executing iteration " . $iteration . '<br>';
    $chunk_of_auto_orders = getAutoOrderChunk($auto_order_api, $offset, $limit);
    $auto_orders = array_merge($auto_orders, $chunk_of_auto_orders);
    $offset = $offset + $limit;
    $more_records_to_fetch = count($chunk_of_auto_orders) == $limit;
    $iteration++;

}

// this could get verbose...
echo '<html lang="en"><body><pre>';
var_dump($auto_orders);
echo '</pre></body></html>';
