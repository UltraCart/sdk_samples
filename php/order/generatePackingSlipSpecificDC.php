<?php

ini_set('display_errors', 1);

/*
 * OrderApi.generatePackingSlipSpecificDC() is a method that might be used by a fulfillment center or distribution
 * center to generate a packing slip to include with a shipment.  As such, this method allows for a packing slip
 * for a specific distribution center (DC) in the case that an order has multiple shipments from multiple DC.
 *
 * You must know the DC, which should not be a problem for any custom shipping application.
 * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377114/Distribution+Center
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\models\OrderFormat;

require_once '../vendor/autoload.php';
require_once '../constants.php';

$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104390';
$dc = 'DFLT';


$api_response = $order_api->generatePackingSlipSpecificDC($dc, $order_id);

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

// the packing slip will return as a base64 encoded
// unpack, save off, email, whatever.
$base64_packing_slip = $api_response->getPdfBase64();


echo '</head><body><pre>';
echo $base64_packing_slip;
echo '</pre></body></html>';
