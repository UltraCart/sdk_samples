<?php

ini_set('display_errors', 1);

/*

Updates a webhook on the account.  See insertWebhook.php for a complete example with field usage.
For this example, we are just updating the basic password.

 */


use ultracart\v2\api\WebhookApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);

// you should have stored this when you created the webhook.  If you don't know it, call getWebhooks and iterate through
// them to find you target webhook (add useful comments to each webhook really helps in this endeavor) and get the
// webhook oid from that.  You'll want to call getWebhooks any way to get the object for updating. It is HIGHLY
// recommended to get the object from UltraCart for updating rather than constructing it yourself to avoid accidentally
// deleting a part of the object during the update.
$webhook_oid = 123456789;

$webhook_to_update = null;
$webhooks = $webhook_api->getWebhooks(100, 0, null, null)->getWebhooks();
foreach ($webhooks as $webhook) {
    if($webhook->getWebhookOid() == $webhook_oid){
        $webhook_to_update = $webhook;
        break;
    }
}

$webhook_to_update->setBasicPassword("new password here");
$api_response = $webhook_api->updateWebhook($webhook_oid, $webhook_to_update);
$updated_webhook = $api_response->getWebhook();

if ($api_response->getError() != null) {
    error_log($api_response->getError()->getDeveloperMessage());
    error_log($api_response->getError()->getUserMessage());
    exit();
}

$created_webhook = $api_response->getWebhook();

echo '<html lang="en"><body><pre>';
var_dump($updated_webhook);
echo '</pre></body></html>';
