<?php

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\CustomerMergeRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

/*
    The merge function was requested by UltraCart merchants that sell software and manage activation keys.  Frequently,
    customers would purchase their software using one email address, and then accidentally re-subscribe using a
    different email address (for example, they purchased subsequent years using PayPal which was tied to their spouse's
    email).  However it happened, the customer now how software licenses spread across multiple emails and therefore
    multiple customer profiles.

    merge combine the customer profiles, merging order history and software entitlements.  Still, it may be used to
    combine any two customer profiles for any reason.

    Success returns back a status code 204 (No Content)
 */

try {

    // first customer
    $first_customer_oid = insertSampleCustomer();

    $second_email = createRandomEmail();
    $second_customer_oid = insertSampleCustomer($second_email);

    $mergeRequest = new CustomerMergeRequest();
    // Supply either the email or the customer oid.  Only need one.
    $mergeRequest->setEmail($second_email);
    // $mergeRequest->setCustomerProfileOid($customer_oid);

    $customer_api = CustomerApi::usingApiKey(Constants::API_KEY);
    $customer_api->mergeCustomer($first_customer_oid, $mergeRequest);

    // clean up this sample.
    deleteSampleCustomer($first_customer_oid);
    // Notice: No need to delete the second sample.  The merge call deletes it.

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


