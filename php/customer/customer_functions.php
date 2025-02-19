<?php

use ultracart\v2\ApiException;
use ultracart\v2\models\Customer;
use ultracart\v2\models\CustomerBilling;
use ultracart\v2\models\CustomerShipping;

require_once '../vendor/autoload.php';
require_once '../samples.php';

// This example was designed for our run_samples.sh script, so the output is not html, but human-readable text.
// In an effort to be repeatable, this script will delete the customer created.
// If you wish to inspect the created customer in the backend, just comment out delete call

function createRandomEmail(): string {
    $rand = str_shuffle('ABCDEFGH');
    return 'sample_' . $rand . ".test.com";
}

/**
 * @return int the new created customer's customer_profile_oid
 * @throws ApiException
 */
function insertSampleCustomer(string $email = null): int{

    /** @noinspection SpellCheckingInspection */
    $rand = str_shuffle('ABCDEFGH');
    if(is_null($email)){
        $email = 'sample_' . $rand . ".test.com";
    }
    echo 'insertSampleCustomer will attempt to create customer ' . $email;
    $customer_api = Samples::getCustomerApi();

    $new_customer = new Customer();
    $new_customer->setEmail($email);
    
    $billing = new CustomerBilling();
    $new_customer->setBilling([$billing]);
    $billing->setFirstName("First" . $rand);
    $billing->setLastName("Last" . $rand);
    $billing->setCompany("Company" . $rand);
    $billing->setCountryCode("US");
    $billing->setStateRegion("GA");
    $billing->setCity("Duluth");
    $billing->setPostalCode("30097");
    $billing->setAddress1("11960 Johns Creek Parkway");

    $shipping = new CustomerShipping();
    $new_customer->setShipping([$shipping]);
    $shipping->setFirstName("First" . $rand);
    $shipping->setLastName("Last" . $rand);
    $shipping->setCompany("Company" . $rand);
    $shipping->setCountryCode("US");
    $shipping->setStateRegion("GA");
    $shipping->setCity("Duluth");
    $shipping->setPostalCode("30097");
    $shipping->setAddress1("11960 Johns Creek Parkway");


    $expand = 'billing,shipping'; // I want to see the address fields returned on the newly created object.
    /*  Possible Expansion variables:
        attachments
        billing
        cards
        cc_emails
        loyalty
        orders_summary
        pricing_tiers
        privacy
        properties
        quotes_summary
        reviewer
        shipping
        software_entitlements
        tags
        tax_codes
     */

    echo 'insertCustomer request object follows:';
    var_dump($new_customer);
    $api_response = $customer_api->insertCustomer($new_customer, $expand);
    echo 'insertCustomer response object follows:';
    var_dump($api_response);

    return $api_response->getCustomer()->getCustomerProfileOid();
}


/**
 * If you don't know the customer oid, call getCustomerByEmail first to retrieve
 * the customer, grab the oid, and use it.
 * @param $customer_oid int customer oid of the customer to be deleted
 * @return void
 * @throws ApiException
 */
function deleteSampleCustomer(int $customer_oid) {
    $customer_api = Samples::getCustomerApi();

    echo 'calling deleteCustomer(' . $customer_oid . ')';
    $customer_api->deleteCustomer($customer_oid);
}
