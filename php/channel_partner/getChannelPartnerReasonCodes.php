<?php

ini_set('display_errors', 1);

/*
    Retrieves a list of all channel partner reason codes the merchant may or may not have configured.
 */


use ultracart\v2\api\ChannelPartnerApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$channel_partner_api = ChannelPartnerApi::usingApiKey(Constants::CHANNEL_PARTNER_API_KEY);
$api_response = $channel_partner_api->getChannelPartnerReasonCodes(18413);


if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';