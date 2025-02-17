<?php

ini_set('display_errors', 1);

/*

This method can be confusing due to its payload.  The method does indeed delete a webhook by url, but you need to
pass a webhook object in as the payload.  However, only the url is used.  UltraCart does this to avoid any confusion
with the rest url versus the webhook url.

To use:
Get your webhook url.
Create a Webhook object.
Set the Webhook url property.
Pass the webhook to deleteWebhookByUrl()

Returns status code 204 (No Content) on success

*/


use ultracart\v2\api\WebhookApi;
use ultracart\v2\models\Webhook;

require_once '../vendor/autoload.php';
require_once '../constants.php';

$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);

$webhook_url = "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php";
$webhook = new Webhook();
$webhook->setWebhookUrl($webhook_url);

$webhook_api->deleteWebhookByUrl($webhook);
