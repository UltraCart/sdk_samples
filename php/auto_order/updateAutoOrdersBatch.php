<?php

use ultracart\v2\models\AutoOrdersRequest;

ini_set('display_errors', 1);

/*
 *
 * This method allows for updating multiple auto orders.
 * Warning: Take great care editing auto orders.  They are complex.
 * Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
 * to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
 * make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.
 *
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';


$auto_order_api = Samples::getAutoOrderApi();

// The _async parameter is what it seems.  True if async.
// The max records allowed depends on the async flag.  Synch max is 20, Asynch max is 100.

$_async = true; // if true, success returns back a 204 No Content.  False returns back the updated orders.
$_expand = null;  // since we're async, nothing is returned, so we don't care about expansions.
// If you are doing a synchronous operation, then set your $_expand appropriately.  set getAutoOrders()
// sample for expansion samples.
$_placeholders = false; // mostly used for UI, not needed for a pure scripting operation.

$auto_orders = [];  // TODO: This should be an array of auto orders that have been updated.  See any getAutoOrders method for retrieval.
$autoOrdersRequest = new AutoOrdersRequest();
$api_response = $autoOrdersRequest->setAutoOrders($auto_orders);

$auto_order_api->updateAutoOrdersBatch($autoOrdersRequest, $_expand, $_placeholders, $_async);
if(!is_null($api_response)){
    // something went wrong if we have a response.
    var_dump($api_response);
}

