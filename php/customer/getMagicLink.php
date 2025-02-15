<?php

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

/*
    getMagicLink returns back a url whereby a merchant can log into their website as the customer.
    This may be useful to "see what the customer is seeing" and is the only method to do so since
    the customer's passwords are encrypted.  Note: A merchant may also do this using the UltraCart
    backend site within the Customer Management section.
 */

try {

    $customer_api = CustomerApi::usingApiKey(Constants::API_KEY);

    // create a customer
    $customer_oid = insertSampleCustomer();
    $storefront = "www.website.com";  // required.  many merchants have dozens of storefronts. which one?

    $api_response = $customer_api->getMagicLink($customer_oid, $storefront);
    $url = $api_response->getUrl();


    echo "<html><body><script>window.location.href = " . json_encode($url) . ";</script></body></html>";

    // clean up this sample. - don't do this or the above magic link won't work.  But you'll want to clean up this
    // sample customer manually using the backend.
    // deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


