<?php

ini_set('display_errors', 1);

/*
 * searchFraudRules returns the fraud rules that match the supplied criteria.  Every field on the
 * FraudRuleSearchRequest is optional; supply only the ones you want to filter on.  The call also
 * takes limit, offset, and sort parameters for paging the results.
 *
 * This sample searches for every rule whose action is "Decline Transaction".
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

use ultracart\v2\models\FraudRuleSearchRequest;

$fraud_api = Samples::getFraudApi();

$search_request = new FraudRuleSearchRequest();
$search_request->setFailureAction('Decline Transaction');

$limit = 100;
$offset = 0;
$sort = null;

$api_response = $fraud_api->searchFraudRules($search_request, $limit, $offset, $sort);

$fraud_rules = $api_response->getFraudRules();
echo "Found " . count($fraud_rules) . " rule(s) with action 'Decline Transaction'\n";

foreach ($fraud_rules as $fraud_rule) {
    echo "  oid " . $fraud_rule->getFraudRuleOid() . " - " . $fraud_rule->getRuleType()
        . " - " . $fraud_rule->getAutoNote() . "\n";
}
