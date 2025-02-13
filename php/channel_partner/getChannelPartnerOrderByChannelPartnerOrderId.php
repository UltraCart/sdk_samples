<?php

ini_set('display_errors', 1);

/*
 * ChannelPartnerApi.getChannelPartnerOrderByChannelPartnerOrderId() retrieves a single order for a given
 * channel partner order_id.  This might be useful for call centers which only have their order ids and not UltraCart's.
 * It is identical to the OrderApi.getOrder() call in functionality and result,
 * but allows for a restricted permission set.  The channel partner api assumes a tie to a Channel Partner and
 * only allows retrieval of orders created by that Channel Partner.
 */


use ultracart\v2\api\ChannelPartnerApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);


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

// A channel partner will almost always query an order for the purpose of turning around and submitting it to a refund call.
// As such, the expansion most likely needed is listed below.
$expansion = "item,summary,shipping";


// This order MUST be an order associated with this channel partner or you will receive a 400 Bad Request.
$channel_partner_order_id = 'MY-CALL-CENTER-BLAH-BLAH';
$api_response = $channel_partner_api->getChannelPartnerOrderByChannelPartnerOrderId($channel_partner_order_id, $expansion);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$order = $api_response->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($order);
echo '</pre></body></html>';
