<?php

ini_set('display_errors', 1);

/*
 * OrderApi.updateOrder() allows for order modification.
 * The modification will not trigger any refunds or additional charges to customers.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderItem;

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
$expansion = "item"; // this is critical since we are adding an item to an order.

$order_id = 'DEMO-0009104390';
$order = $order_api->getOrder($order_id, $expansion)->getOrder();


// for this sample, we are adding an item. the properties listed below are the minimum properties needed for an item.
$items = $order->getItems();

$new_item = new OrderItem();
$new_item->setQuantity(2);
$new_item->setMerchantItemId('TSHIRT');
$new_item->setDescription("A blue shirt or something...");
$new_item->setCost(new \ultracart\v2\models\Currency(['value' => 9.99]));
$new_item->setWeight(new \ultracart\v2\models\Weight(['uom' => "OZ", 'value' => 5]));
// If you have more than one DC, don't assume the code. query the item using ItemApi and look it up on the item.
// See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
$new_item->setDistributionCenterCode('DFLT');


$api_response = $order_api->updateOrder($order, $order_id, $expansion);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$updated_order = $api_response->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($updated_order);
echo '</pre></body></html>';
