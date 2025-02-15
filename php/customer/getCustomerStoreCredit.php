<?php

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\CustomerStoreCreditAddRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

/*
    getCustomerStoreCredit returns back the store credit for a customer, which includes:
    total - lifetime credit
    available - currently available store credit
    vesting - amount of store credit vesting
    expiring - amount of store credit expiring within 30 days
    pastLedgers - transaction history
    futureLedgers - future transactions including expiring entries
 */

try {

    $customer_api = CustomerApi::usingApiKey(Constants::API_KEY);

    // create a customer
    $customer_oid = insertSampleCustomer();

    // add some store credit.
    $addRequest = new CustomerStoreCreditAddRequest();
    $addRequest->setDescription('First credit add');
    $addRequest->setVestingDays(10);
    $addRequest->setExpirationDays(20); // that's not a lot of time!
    $addRequest->setAmount(20);
    $customer_api->addCustomerStoreCredit($customer_oid, $addRequest);

    // add more store credit.
    $addRequest = new CustomerStoreCreditAddRequest();
    $addRequest->setDescription('Second credit add');
    $addRequest->setVestingDays(0); // immediately available.
    $addRequest->setExpirationDays(90);
    $addRequest->setAmount(40);
    $customer_api->addCustomerStoreCredit($customer_oid, $addRequest);


    $api_response = $customer_api->getCustomerStoreCredit($customer_oid);
    $storeCredit = $api_response->getCustomerStoreCredit();

    var_dump($storeCredit); // <-- There's a lot of information inside this object.

    // clean up this sample.
    deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


