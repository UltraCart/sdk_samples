<?php

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';

$item_api = Samples::getItemApi();


try {
    /*
     * Possible expansion values for PricingTier object:
     * approval_notification
     * signup_notification
     */

    $expand = "approval_notification,signup_notification";
    $api_response = $item_api->getPricingTiers($expand);

} catch (ApiException $e) {
    echo 'ApiException occurred.';
    var_dump($e);
    die(1);
}

var_dump($api_response->getPricingTiers());
