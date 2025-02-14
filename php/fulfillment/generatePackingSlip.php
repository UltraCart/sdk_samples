<?php

ini_set('display_errors', 1);

/*
    generatePackingSlip accepts a distribution center code and order_id and returns back a base64 encoded byte array pdf.
    Both the dc code and order_id are needed because an order may have multiple items shipping via different DCs.

    You will need the distribution center (DC) code.  UltraCart allows for multiple DC and the code is a
    unique short string you assign to a DC as an easy mnemonic.

    For more information about UltraCart distribution centers, please see:
    https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center

    If you do not know your DC code, query a list of all DC and print them out.
    $result = $fulfillment_api->getDistributionCenters();
    print_r($result);

 */


use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';

$fulfillment_api = Samples::getFulfillmentApi();

$distribution_center_code = 'RAMI';
$orders_id = 'DEMO-12345';

echo '<pre>';

try {
    // limit is 500 inventory updates at a time.  batch them if you're going large.
    $api_response = $fulfillment_api->generatePackingSlip($distribution_center_code, $orders_id);
    $base64_pdf = $api_response->getPdfBase64();
    $decoded_pdf = base64_decode($base64_pdf);
    file_put_contents('packing_slip.pdf', $decoded_pdf);

    echo "done";
} catch (ApiException $e) {
    // update inventory failed.  examine the reason.
    echo 'Exception when calling FulfillmentApi->generatePackingSlip: ', $e->getMessage(), PHP_EOL;
    exit;
}