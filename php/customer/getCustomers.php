<?php

set_time_limit(3000); // pulling all records could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to retrieve customers.  It uses the pagination logic necessary to query all customers.
 * This method was the first getCustomers and has parameters for all the search terms.  It's an ogre.  Using
 * getCustomersByQuery is much easier to use.
 */

use ultracart\v2\api\CustomerApi;
use ultracart\v2\ApiException;

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
    
    // TODO: Seriously, use getCustomersByQuery -- it's so much better than this old method.
    $email = null; 
    $qb_class = null; 
    $quickbooks_code = null; 
    $last_modified_dts_start = null; 
    $last_modified_dts_end = null; 
    $signup_dts_start = null; 
    $signup_dts_end = null; 
    $billing_first_name = null; 
    $billing_last_name = null; 
    $billing_company = null; 
    $billing_city = null; 
    $billing_state = null; 
    $billing_postal_code = null; 
    $billing_country_code = null; 
    $billing_day_phone = null; 
    $billing_evening_phone = null; 
    $shipping_first_name = null; 
    $shipping_last_name = null; 
    $shipping_company = null; 
    $shipping_city = null; 
    $shipping_state = null; 
    $shipping_postal_code = null; 
    $shipping_country_code = null; 
    $shipping_day_phone = null; 
    $shipping_evening_phone = null; 
    $pricing_tier_oid = null; 
    $pricing_tier_name = null; 
    $_limit = $limit;
    $_offset = $offset;
    $_since = null; 
    $_sort = null;
    
    $api_response = $customer_api->getCustomers($email, $qb_class, $quickbooks_code, $last_modified_dts_start, $last_modified_dts_end, $signup_dts_start, $signup_dts_end, $billing_first_name, $billing_last_name, $billing_company, $billing_city, $billing_state, $billing_postal_code, $billing_country_code, $billing_day_phone, $billing_evening_phone, $shipping_first_name, $shipping_last_name, $shipping_company, $shipping_city, $shipping_state, $shipping_postal_code, $shipping_country_code, $shipping_day_phone, $shipping_evening_phone, $pricing_tier_oid, $pricing_tier_name, $_limit, $_offset, $_since, $_sort, $_expand);

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
