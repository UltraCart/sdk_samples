<?php

set_time_limit(3000); // pulling all records could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to retrieve all webhooks.
 */

use ultracart\v2\api\WebhookApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';


$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);


/**
 * @throws ApiException
 */
function getWebhookChunk(WebhookApi $webhook_api, int $offset, int $limit): array
{

    $_sort = null; // default sorting is webhook_url, disabled, and those are also the two choices for sorting.
    $_placeholders = null;  // useful for UI displays, but not needed here.
    // Pay attention to whether limit or offset comes first in the method signature.  UltraCart is not consistent with their ordering.
    $api_response = $webhook_api->getWebhooks($limit, $offset, $_sort, $_placeholders);

    if ($api_response->getWebhooks() != null) {
        return $api_response->getWebhooks();
    }
    return [];
}

$webhooks = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

try {
    while ($more_records_to_fetch) {

        echo "executing iteration " . $iteration . '<br>';

        $chunk_of_webhooks = getWebhookChunk($webhook_api, $offset, $limit);
        $orders = array_merge($webhooks, $chunk_of_webhooks);
        $offset = $offset + $limit;
        $more_records_to_fetch = count($chunk_of_webhooks) == $limit;
        $iteration++;
    }
} catch (ApiException $e) {
    echo 'ApiException occurred on iteration ' . $iteration;
    var_dump($e);
    die(1);
}


// this will be verbose...
var_dump($webhooks);