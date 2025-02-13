<?php

ini_set('display_errors', 1);

/*
 Deletes a ChannelPartnerShiptoPreference.  These preferences are used by EDI channel partners to automatically
 apply return policies and add additional free items to EDI orders based on the EDI code that is present.

 Success will return a status code 204 (No content)

 Possible Errors:
 Attempting to interact with a channel partner other than the one tied to your API Key:
    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 Supply a bad preference oid: "Invalid channel_partner_ship_to_preference_oid specified."

 */


use ultracart\v2\api\ChannelPartnerApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);
$channel_partner_shipto_preference_oid = 67890; // you will usually get this by calling getChannelPartnerShipToPreferences()
$channel_partner_oid = 12345;

$channel_partner_api->deleteChannelPartnerShipToPreference($channel_partner_oid, $channel_partner_shipto_preference_oid);
