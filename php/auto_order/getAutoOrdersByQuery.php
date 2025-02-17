<?php

set_time_limit(3000); // pull all records could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to retrieve auto orders and handle pagination.
 */

use ultracart\v2\api\AutoOrderApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();


/**
 * @throws ApiException
 */
function getAutoOrderChunk(AutoOrderApi $auto_order_api, int $offset, int $limit): array
{

    /**
     * These are the possible expansion values for auto orders.  This list is taken from www.ultracart.com/api/
     * and may become stale. Please review the master website when in doubt.
    items
    items.future_schedules
    items.sample_schedule
    original_order
    original_order.affiliate
    original_order.affiliate.ledger
    original_order.auto_order
    original_order.billing
    original_order.buysafe
    original_order.channel_partner
    original_order.checkout
    original_order.coupon
    original_order.customer_profile
    original_order.digital_order
    original_order.edi
    original_order.fraud_score
    original_order.gift
    original_order.gift_certificate
    original_order.internal
    original_order.item
    original_order.linked_shipment
    original_order.marketing
    original_order.payment
    original_order.payment.transaction
    original_order.quote
    original_order.salesforce
    original_order.shipping
    original_order.summary
    original_order.taxes
    rebill_orders
    rebill_orders.affiliate
    rebill_orders.affiliate.ledger
    rebill_orders.auto_order
    rebill_orders.billing
    rebill_orders.buysafe
    rebill_orders.channel_partner
    rebill_orders.checkout
    rebill_orders.coupon
    rebill_orders.customer_profile
    rebill_orders.digital_order
    rebill_orders.edi
    rebill_orders.fraud_score
    rebill_orders.gift
    rebill_orders.gift_certificate
    rebill_orders.internal
    rebill_orders.item
    rebill_orders.linked_shipment
    rebill_orders.marketing
    rebill_orders.payment
    rebill_orders.payment.transaction
    rebill_orders.quote
    rebill_orders.salesforce
    rebill_orders.shipping
    rebill_orders.summary
    rebill_orders.taxes
     */
    $expand = "items,items.future_schedules,original_order,rebill_orders"; // contact us if you're unsure what you need
    
    /*
     * These are the supported sorting fields:
    auto_order_code 
    order_id
    shipping.company 
    shipping.first_name 
    shipping.last_name 
    shipping.city 
    shipping.state_region
    shipping.postal_code 
    shipping.country_code 
    billing.phone 
    billing.email 
    billing.cc_email
    billing.company 
    billing.first_name 
    billing.last_name 
    billing.city 
    billing.state
    billing.postal_code 
    billing.country_code 
    creation_dts 
    payment.payment_dts
    checkout.screen_branding_theme_code
    next_shipment_dts
     */

    $_since = null;
    $_sort = "next_shipment_dts";
    $query = new ultracart\v2\models\AutoOrderQuery();
    $query->setEmail("support@ultracart.com");
    $api_response = $auto_order_api->getAutoOrdersByQuery($query, $limit, $offset, $_sort, $expand);

    if ($api_response->getAutoOrders() != null) {
        return $api_response->getAutoOrders();
    }
    return [];
}

$auto_orders = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

try {
    while ($more_records_to_fetch) {

        echo "executing iteration " . $iteration . '<br>';

        $chunk_of_orders = getAutoOrderChunk($auto_order_api, $offset, $limit);
        $orders = array_merge($auto_orders, $chunk_of_orders);
        $offset = $offset + $limit;
        $more_records_to_fetch = count($chunk_of_orders) == $limit;
        $iteration++;
    }
} catch (ApiException $e) {
    echo 'ApiException occurred on iteration ' . $iteration;
    var_dump($e);
    die(1);
}


// this will be verbose...
var_dump($auto_orders);
