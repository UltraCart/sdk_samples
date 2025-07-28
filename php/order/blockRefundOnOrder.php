<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/**
 * blockRefundOnOrder sets an order property that is considered when a refund request is made.
 * If the property is present, the refund is denied.  Being an order property allows for querying
 * upon it within BigQuery for audit purposes.
 */
$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009105222';
$order_api->blockRefundOnOrder($order_id, 'Chargeback');

echo '<html lang="en"><body><pre>';
echo 'method executed successfully, returns back 204 No Content.';
echo '</pre></body></html>';
