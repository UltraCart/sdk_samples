<?php

ini_set('display_errors', 1);

/*
 * OrderApi.assignRma() assigns an RMA (return merchandise authorization) number to an order.
 *
 * The rma value is required, may be at most 30 characters, and is trimmed by the server.
 * Assigning an RMA replaces any RMA already on the order, and a merchant note is added to the order
 * recording the change.  The optional expansion controls how much of the updated order is returned.
 *
 * Requires the order_write scope.
 */

use ultracart\v2\api\OrderApi;
use ultracart\v2\ApiException;
use ultracart\v2\models\OrderAssignRmaRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$order_api = OrderApi::usingApiKey(Constants::API_KEY);

$order_id = 'DEMO-0009104390';

$assign_rma_request = new OrderAssignRmaRequest();
$assign_rma_request->setRma('RMA-12345');

// see www.ultracart.com/api/ for all the expansion fields available
$expansion = "item,summary";

try {
    $api_response = $order_api->assignRma($order_id, $assign_rma_request, $expansion);
} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$order = $api_response->getOrder();

echo '<html lang="en"><body><pre>';
var_dump($order);
echo '</pre></body></html>';
