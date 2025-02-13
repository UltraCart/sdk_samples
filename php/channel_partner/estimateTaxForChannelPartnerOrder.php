<?php

ini_set('display_errors', 1);

/*
 This is a helper function for call centers to calculate the tax on an order.  In a typical flow, the call center
 will collect all the shipping information and items being purchased into a ChannelPartnerOrder object.
 They will then call this method, passing in the order object.  The response will contain the tax that should be
 collected.  They can then plug that tax into their call center application and complete the order.

 Possible Errors:
 Using an API key that is not tied to a channel partner: "This API Key does not have permission to interact with channel partner orders.  Please review your Channel Partner configuration."
 Order has invalid channel partner code: "Invalid channel partner code"
 Order has no items: "null order.items passed." or "order.items array contains a null entry."
 Order has no channel partner order id: "order.channelPartnerOrderId must be specified."
 Order channel partner order id is a duplicate:  "order.channelPartnerOrderId [XYZ] already used."
 Channel Partner is inactive: "partner is inactive."


 */


use ultracart\v2\api\ChannelPartnerApi;
use ultracart\v2\models\ChannelPartnerOrder;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);
$channel_partner_order = new ChannelPartnerOrder();
// TODO: Populate the channel partner order.  See importChannelPartnerOrder for field examples.

$api_response = $channel_partner_api->estimateTaxForChannelPartnerOrder($channel_partner_order);
$arbitraryTax = $api_response->getArbitraryTax();
// TODO: Apply this tax to your channel partner order.


echo '<html lang="en"><body><pre>';
var_dump($arbitraryTax);
echo '</pre></body></html>';
