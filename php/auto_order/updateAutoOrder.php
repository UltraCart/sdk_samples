<?php

ini_set('display_errors', 1);

/*
 *
 * This method allows for updating an auto order.
 * Warning: Take great care editing auto orders.  They are complex.
 * Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
 * to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
 * make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.
 *
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

$_expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
$auto_order_oid = 123456789; // get an auto order and update it.  There are many ways to retrieve an auto order.
$api_response = $auto_order_api->getAutoOrder($auto_order_oid);
$auto_order = $api_response->getAutoOrder();
$validate_original_order = 'No';

// for this example, the customer supplied the wrong postal code when ordering.  So to change the postal code for
// all subsequent auto orders, we change the original order.
$auto_order->getOriginalOrder()->getBilling()->setPostalCode('44233');

$api_response = $auto_order_api->updateAutoOrder($auto_order_oid, $auto_order, $validate_original_order, $_expand);
$updated_auto_order = $api_response->getAutoOrder();
var_dump($updated_auto_order);


