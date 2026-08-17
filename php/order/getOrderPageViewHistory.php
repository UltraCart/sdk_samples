<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    getOrderPageViewHistory returns the page views captured during the session that placed an order,
    along with the referrer that started that session.

    A customer profile is NOT required.  These page views are keyed off an analytics client id stored on
    the order itself, so this works for guest orders.  For the email engagement side of customer activity,
    use getOrderCustomerActivity instead.

    An order placed outside the storefront, such as a phone order or an order imported from a channel
    partner, will have no analytics session attached.  In that case page_views comes back empty.  That is
    a successful response rather than an error.

    Note: view_dts is an ISO 8601 string here.  Be aware that the ts field on getOrderCustomerActivity is
    unix milliseconds instead, so do not assume the two methods format dates the same way.

    Possible Errors:
    order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."

 */


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009104976';
$response = $order_api->getOrderPageViewHistory($order_id);

$page_views = $response->getPageViews();

echo '<html lang="en"><body><pre>';
echo 'Session referrer: ' . ($response->getReferrer() ?: '(none captured)') . "\n\n";

if (empty($page_views)) {
    echo 'No page views were captured for this order.';
} else {
    foreach ($page_views as $page_view) {
        echo $page_view->getViewDts() . ' - ' . $page_view->getUrl() . "\n";
    }

    echo "\n";
    var_dump($page_views);
}

echo '</pre></body></html>';
