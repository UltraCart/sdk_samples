<?php

set_time_limit(3000); // pulling all records could take a long time.
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);

/*
 * This example illustrates how to retrieve webhook log summaries.
 */

use ultracart\v2\api\WebhookApi;
use ultracart\v2\ApiException;

require_once '../vendor/autoload.php';
require_once '../samples.php';


$webhook_api = WebhookApi::usingApiKey(Constants::API_KEY);


/**
 * @throws ApiException
 */
function getSummaryChunk(WebhookApi $webhook_api, int $offset, int $limit): array
{
    $webhook_oid = 123456789; // if you don't know this, use getWebhooks to find your webhook, then get its oid.
    $_since = date('Y-m-d', strtotime('-10 days')) . "T00:00:00+00:00"; // get the last 10 days
    // Pay attention to whether limit or offset comes first in the method signature.  UltraCart is not consistent with their ordering.
    $api_response = $webhook_api->getWebhookLogSummaries($webhook_oid, $limit, $offset, $_since);

    if ($api_response->getWebhookLogSummaries() != null) {
        return $api_response->getWebhookLogSummaries();
    }
    return [];
}

$summaries = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

try {
    while ($more_records_to_fetch) {

        echo "executing iteration " . $iteration . '<br>';

        $chunk_of_summaries = getSummaryChunk($webhook_api, $offset, $limit);
        $orders = array_merge($summaries, $chunk_of_summaries);
        $offset = $offset + $limit;
        $more_records_to_fetch = count($chunk_of_summaries) == $limit;
        $iteration++;
    }
} catch (ApiException $e) {
    echo 'ApiException occurred on iteration ' . $iteration;
    var_dump($e);
    die(1);
}


// this will be verbose...
var_dump($summaries);