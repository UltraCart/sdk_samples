<?php

ini_set('display_errors', 1);

/*
    Retrieves a list of all channel partners configured for this merchant.  If the API KEY used is tied to a specific
    Channel Partner, then the results will contain only that Channel Partner.
 */


use ultracart\v2\api\ChannelPartnerApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);
$api_response = $channel_partner_api->getChannelPartners();


if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$channel_partners = $api_response->getChannelPartners();

echo '<html lang="en"><body><pre>';
foreach ($channel_partners as $channel_partner) {
    var_dump($channel_partner);
}
echo '</pre></body></html>';
