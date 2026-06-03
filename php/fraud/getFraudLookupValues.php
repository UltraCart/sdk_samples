<?php

ini_set('display_errors', 1);

/*
 * getFraudLookupValues returns the lookup values used when building fraud rules:
 * the allowed countries, affiliates, ip range types, rule groups, and rule types.
 * Call this first when constructing a rule so you supply valid values.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

$fraud_api = Samples::getFraudApi();

$api_response = $fraud_api->getFraudLookupValues();

$lookup_values = $api_response->getFraudLookupValues();

echo "Rule types:\n";
var_dump($lookup_values->getRuleTypes());

echo "Rule groups:\n";
var_dump($lookup_values->getRuleGroups());

echo "IP range types:\n";
var_dump($lookup_values->getIpRangeTypes());

echo "Countries:\n";
var_dump($lookup_values->getCountries());
