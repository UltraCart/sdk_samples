<?php

require_once '../vendor/autoload.php';
require_once '../constants.php';

$order_api = ultracart\v2\api\OrderApi::usingApiKey(Constants::API_KEY);

// for all possible expansion values, see https://www.ultracart.com/api/#Topic3
// here is a static list, but this list may grow stale.  See the link above for current values.
/*
affiliate,
affiliate.ledger
auto_order
billing
buysafe
channel_partner
checkout
coupon
customer_profile
digital_order
edi
fraud_score
gift
gift_certificate
internal
item
linked_shipment
marketing
payment
payment.transaction
quote
salesforce
shipping
shipping.tracking_number_details
summary
taxes
 */
$expansion = "billing,checkout,coupon,customer_profile,item,payment,shipping,summary,taxes";

// the token will be in a $_GET parameter defined by you within your storefront.
// StoreFront -> Privacy and Tracking -> Advanced -> CustomThankYouUrl
// Example would be: www.mysite.com/receipt.php?orderToken=[OrderToken]

$order_token = $_GET['OrderToken'];
// $order_token = 'DEMO:UZBOGywSKKwD2a5wx5JwmkwyIPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g=='; // this won't work for you...
// to generate an order token manually for testing, set generateOrderToken.php
// TODO handle missing order token (perhaps this page somehow called by a search engine, etc.


$order_token_query = new \ultracart\v2\models\OrderByTokenQuery();
$order_token_query->setOrderToken($order_token);
$api_response = $order_api->getOrderByToken($order_token_query, $expansion);
$order = $api_response->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($order);
echo '</pre></body></html>';