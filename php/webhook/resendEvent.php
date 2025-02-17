<?php

ini_set('display_errors', 1);

/*

resentEvent is used to reflow an event.  It will resend ALL events in history.  So it is essentially a way to
get all objects from an event.  Currently, there are only two events available for reflow: "item_update", and "order_create".
These two events provide the means to have a webhook receive all items or orders.  This method is usually called
at the beginning of a webhook's life to prepopulate a merchant's database with all items or orders.

You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.

*/


use ultracart\v2\api\WebhookApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);

$webhook_oid = 123456789; // call getWebhooks if you don't know this.
$event_name = "item_update"; // or "order_create", but for this sample, we want all items.

$api_response = $webhook_api->resendEvent($webhook_oid, $event_name);
$reflow = $api_response->getReflow();
$success = $reflow->getQueued();

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

echo '<html lang="en"><body><pre>';
var_dump($api_response);
echo '</pre></body></html>';
