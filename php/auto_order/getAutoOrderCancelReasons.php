<?php

ini_set('display_errors', 1);

/*
 * Retrieves the list of cancel reasons that can be presented to customers when
 * cancelling an auto order (e.g., in MyAccount). Each reason includes the reason
 * text, an optional MyAccount alternate description, and whether the reason is
 * visible in MyAccount.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

$api_response = $auto_order_api->getAutoOrderCancelReasons();

foreach ($api_response->getCancelReasons() as $cancel_reason) {
    var_dump($cancel_reason);
}
