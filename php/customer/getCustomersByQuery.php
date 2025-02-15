<?php

set_time_limit(3000); // pulling all records could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to retrieve customers.  It uses the pagination logic necessary to query all customers.
 */

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\CustomerQuery;

require_once '../vendor/autoload.php';
require_once '../samples.php';


$customer_api = Samples::getCustomerApi();


/**
 * @throws ApiException
 */
function getCustomerChunk(CustomerApi $customer_api, int $offset, int $limit): array
{

    // The real devil in the getCustomers calls is the expansion, making sure you return everything you need without
    // returning everything since these objects are extremely large.  The customer object can be truly large with
    // all the order history.  These are the possible expansion values.
    /*
        attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
        privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
        tax_codes
     */
    $_expand = "shipping,billing"; // just the address fields.  contact us if you're unsure

    // TODO: This is just showing all the possibilities.  In reality, you'll just assign the filters you need.
    $query = new CustomerQuery();
//    $query->setEmail(null);
//    $query->setQbClass(null);
//    $query->setQuickbooksCode(null);
//    $query->setLastModifiedDtsStart(null);
//    $query->setLastModifiedDtsEnd(null);
//    $query->setSignupDtsStart(null);
//    $query->setSignupDtsEnd(null);
//    $query->setBillingFirstName(null);
//    $query->setBillingLastName(null);
//    $query->setBillingCompany(null);
//    $query->setBillingCity(null);
//    $query->setBillingState(null);
//    $query->setBillingPostalCode(null);
//    $query->setBillingCountryCode(null);
//    $query->setBillingDayPhone(null);
//    $query->setBillingEveningPhone(null);
//    $query->setShippingFirstName(null);
//    $query->setShippingLastName(null);
//    $query->setShippingCompany(null);
//    $query->setShippingCity(null);
//    $query->setShippingState(null);
//    $query->setShippingPostalCode(null);
//    $query->setShippingCountryCode(null);
//    $query->setShippingDayPhone(null);
//    $query->setShippingEveningPhone(null);
//    $query->setPricingTierOid(null);
//    $query->setPricingTierName(null);

    $_since = null;
    $_sort = "email";

    $api_response = $customer_api->getCustomersByQuery($query, $offset, $limit, $_since, $_sort, $_expand);

    if ($api_response->getCustomers() != null) {
        return $api_response->getCustomers();
    }
    return [];
}

$customers = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

try {
    while ($more_records_to_fetch) {

        echo "executing iteration " . $iteration . '<br>';

        $chunk_of_customers = getCustomerChunk($customer_api, $offset, $limit);
        $orders = array_merge($customers, $chunk_of_customers);
        $offset = $offset + $limit;
        $more_records_to_fetch = count($chunk_of_customers) == $limit;
        $iteration++;
    }
} catch (ApiException $e) {
    echo 'ApiException occurred on iteration ' . $iteration;
    var_dump($e);
    die(1);
}


// this will be verbose...
var_dump($customers);
