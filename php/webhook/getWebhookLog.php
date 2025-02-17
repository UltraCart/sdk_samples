<?php

ini_set('display_errors', 1);

/*

getWebhookLog() provides a detail log of a webhook event.  It is used in tandem with getWebhookLogSummaries to audit
webhook events.  This method call will require the webhook_oid and the request_id.  The webhook_oid can be discerned
from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries().  see those examples
if needed.

*/


use ultracart\v2\api\WebhookApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);

$webhook_oid = 123456789; // call getWebhooks if you don't know this.
$request_id = 987654321;  // call getWebhookLogSummaries if you don't know this.

$api_response = $webhook_api->getWebhookLog($webhook_oid, $request_id);
$webhook_log = $api_response->getWebhookLog();

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

echo '<html lang="en"><body><pre>';
var_dump($webhook_log);
echo '</pre></body></html>';
