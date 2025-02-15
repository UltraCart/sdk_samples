<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

// Of the two getCustomer methods, you'll probably always use getCustomerByEmail instead of this one.
// Most customer logic revolves around the email, not the customer oid.   The latter is only meaningful as a primary
// key in the UltraCart databases.  But here is an example of using getCustomer().

try {

    $email = createRandomEmail();
    $customer_oid = insertSampleCustomer($email);
    $customer_api = Samples::getCustomerApi();

    // the _expand variable is set to return just the address fields.
    // see customer_functions.php for a list of expansions, or consult the source: https://www.ultracart.com/api/
    $api_response = $customer_api->getCustomer($customer_oid, "billing,shipping");
    $customer = $api_response->getCustomer(); // assuming this succeeded

    var_dump($customer);

    deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}


