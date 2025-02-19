<?php

ini_set('display_errors', 1);

/*
 Retrieves all shipto preferences for a channel partner.
 These preferences are used by EDI channel partners to automatically
 apply return policies and add additional free items to EDI orders based on the EDI code that is present.

 Possible Errors:
 Attempting to interact with a channel partner other than the one tied to your API Key:
    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."

 */


use ultracart\v2\api\ChannelPartnerApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);
$channel_partner_oid = 12345;
$api_response = $channel_partner_api->getChannelPartnerShipToPreferences($channel_partner_oid);


if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$preferences = $api_response->getShipToPreferences();

echo '<html lang="en"><body><pre>';
foreach ($preferences as $preference) {
    var_dump($preference);
}
echo '</pre></body></html>';
