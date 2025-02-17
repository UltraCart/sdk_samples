<?php

ini_set('display_errors', 1);

/*

deletes a webhook

You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.
Returns status code 204 (No Content) on success

*/


use ultracart\v2\api\WebhookApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);
$webhook_oid = 123456789; // call getWebhooks if you don't know this.
$webhook_api->deleteWebhook($webhook_oid);
