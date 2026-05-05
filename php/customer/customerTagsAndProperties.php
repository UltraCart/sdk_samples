<?php
/** @noinspection SpellCheckingInspection */
/** @noinspection GrazieInspection */

use ultracart\v2\ApiException;
use ultracart\v2\models\CustomerProperty;
use ultracart\v2\models\CustomerTag;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

// Of the two getCustomer methods, you'll probably always use getCustomerByEmail instead of this one.
// Most customer logic revolves around the email, not the customer oid.   The latter is only meaningful as a primary
// key in the UltraCart databases.  But here is an example of using getCustomer().

try {
    echo "<html><body><pre>";

    $expansion = "billing,shipping,tags,properties";
    $email = createRandomEmail();
    $customer_oid = insertSampleCustomer($email);
    $customer_api = Samples::getCustomerApi();

    // the _expand variable is set to return just the address fields.
    // see customer_functions.php for a list of expansions, or consult the source: https://www.ultracart.com/api/
    $api_response = $customer_api->getCustomer($customer_oid, $expansion);
    $customer = $api_response->getCustomer(); // assuming this succeeded

    // Add properties
    $property = new CustomerProperty();
    $property->setName('test');
    $property->setValue('321');
    $customer->setProperties([$property]);

    // Add tags
    $tags = [];
    $tag = new CustomerTag();
    $tag->setTagValue('imported');
    $tags[] = $tag;
    $customer->setTags($tags);


    $response = $customer_api->updateCustomer($customer_oid, $customer, $expansion);

    echo "<hr><br><h1>Final Customer Data</h1><br><hr>";

    var_dump($customer);

    // deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
echo "</pre></body>";