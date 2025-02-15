<?php

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

try {


    $customer_oid = insertSampleCustomer();

    $customer_api = CustomerApi::usingApiKey(Constants::API_KEY);
    // just want address fields.  see https://www.ultracart.com/api/#resource_customer.html for all expansion values
    $_expand = "billing,shipping";
    $customer = $customer_api->getCustomer($customer_oid, $_expand)->getCustomer();
    // TODO: do some edits to the customer.  Here we will change some billing fields.
    $customer->getBilling()[0]->setAddress2('Apartment 101');

    // notice expand is passed to update as well since it returns back an updated customer object.
    // we use the same expansion, so we get back the same fields and can do comparisons.
    $api_response = $customer_api->updateCustomer($customer_oid, $customer, $_expand);

    // verify the update
    var_dump($api_response->getCustomer());

    deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


