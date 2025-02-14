<?php

ini_set('display_errors', 1);

/*
    This method returns back a list of all distribution centers configured for a merchant.

    You will need the distribution center (DC) code for most operations.
    UltraCart allows for multiple DC and the code is a unique short string you assign to a DC as an easy mnemonic.
    This method call is an easy way to determine what a DC code is for a particular distribution center.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

 */


use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';

$fulfillment_api = Samples::getFulfillmentApi();

echo '<pre>';

try {
    $result = $fulfillment_api->getDistributionCenters();
    print_r($result);

    echo "done";
} catch (ApiException $e) {
    // update inventory failed.  examine the reason.
    echo 'Exception when calling FulfillmentApi->getDistributionCenters: ', $e->getMessage(), PHP_EOL;
    exit;
}