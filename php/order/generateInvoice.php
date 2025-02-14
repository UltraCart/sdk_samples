<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    generateInvoice returns back a base64 encoded byte array of the given order's Invoice in PDF format.

 */

$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009104976';
$api_response = $order_api->generateInvoice($order_id);

// the packing slip will return as a base64 encoded
// unpack, save off, email, whatever.
$base64_pdf = $api_response->getPdfBase64();

$decoded_pdf = base64_decode($base64_pdf);
file_put_contents('invoice.pdf', $decoded_pdf);


// Set the PDF headers
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="invoice.pdf"');
header('Cache-Control: public, must-revalidate, max-age=0');
header('Pragma: public');
header('Content-Length: ' . strlen($decoded_pdf));

// Output the PDF bytes
echo $decoded_pdf;
exit;
