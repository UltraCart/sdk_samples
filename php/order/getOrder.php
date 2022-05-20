<?php

ini_set('display_errors', 1);

/*
 * OrderApi.getOrder() retrieves a single order for a given order_id.
 */

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

// The expansion variable instructs UltraCart how much information to return.  The order object is large and
// while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
// payload size.
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
$expansion = "item,summary,billing,shipping,shipping.tracking_number_details";

$order_id = 'DEMO-0009104390';
$api_response = $order_api->getOrder($order_id, $expansion);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$order = $api_response->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($order);
echo '</pre></body></html>';
