<?php

/*
    This is a checkout api method.  It creates a browser key for use in a client side checkout.  This call must be
    made server side with a Simple API Key or an OAuth access_token.
 */

use ultracart\v2\api\CheckoutApi;
use ultracart\v2\models\CheckoutSetupBrowserKeyRequest;

require_once '../vendor/autoload.php';

$checkout_api = CheckoutApi::usingApiKey(Constants::API_KEY);

$keyRequest = new CheckoutSetupBrowserKeyRequest();
$keyRequest->setAllowedReferrers(["https://www.mywebsite.com"]);
$browser_key = $checkout_api->setupBrowserKey($keyRequest)->getBrowserKey();

echo '<html lang="en"><body><pre>';
var_dump($browser_key);
echo '</pre></body></html>';
