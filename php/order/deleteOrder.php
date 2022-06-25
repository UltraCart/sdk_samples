<?php

/*
 * OrderApi.deleteOrder() will do just that.  It will delete an order.
 * You might find it more useful to reject an order rather than delete it in order to leave an audit trail.
 * However, deleting test orders will be useful to keep your order history tidy.  Still, any order
 * may be deleted.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

$order_api = Samples::getOrderApi();

$order_id = 'DEMO-0008104390';
$order_api->deleteOrder($order_id);
echo 'Order was deleted successfully.';

