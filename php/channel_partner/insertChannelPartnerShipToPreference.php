<?php

ini_set('display_errors', 1);

/*
 Inserts a channel partner shipto preference for a channel partner.
 These preferences are used by EDI channel partners to automatically
 apply return policies and add additional free items to EDI orders based on the EDI code that is present.

 Possible Errors:
 Attempting to interact with a channel partner other than the one tied to your API Key:
    "Invalid channel_partner_oid specified.  Your REST API key may only interact with channel_partner_oid: 12345"
 Supplying a bad channel partner oid: "Invalid channel_partner_oid specified."

 */


use ultracart\v2\api\ChannelPartnerApi;
use ultracart\v2\models\ChannelPartnerShipToPreference;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);
$channel_partner_oid = 12345;

$preference = new ChannelPartnerShipToPreference();
$preference->setChannelPartnerOid($channel_partner_oid);
$preference->setShipToEdiCode('EDI_CODE_HERE');
$preference->setReturnPolicy("This is some return policy text that will be printed on the packing slip.");
$preference->setAdditionalKitComponentItemIds(['ITEM_ID1', 'ITEM_ID2', 'ITEM_ID3']);
$preference->setDescription("This is a merchant friendly description to help me remember what the above setting are.");

$api_response = $channel_partner_api->insertChannelPartnerShipToPreference($channel_partner_oid, $preference);


if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$inserted_preference = $api_response->getShipToPreference();

echo '<html lang="en"><body><pre>';
// This should equal what you submitted.
var_dump($inserted_preference);
echo '</pre></body></html>';
