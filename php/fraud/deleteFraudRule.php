<?php

ini_set('display_errors', 1);

/*
 * deleteFraudRule removes a fraud rule by its oid.
 *
 * To keep this sample self-contained it first inserts a throwaway rule, then deletes it using
 * the oid returned from the insert.  In your own code you would already have the oid of the rule
 * you want to remove (for example from searchFraudRules).
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

use ultracart\v2\models\FraudRuleInsertRequest;

$fraud_api = Samples::getFraudApi();

// Insert a rule so we have something to delete.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('credit card single transaction exceeds');
$rule->setAmountThreshold(2500.00);
$rule->setFailureAction('Flag For Review');
$rule->setAutoNote('Temporary rule created by the deleteFraudRule sample');

$insert_response = $fraud_api->insertFraudRule($rule);
$fraud_rule_oid = $insert_response->getFraudRule()->getFraudRuleOid();
echo "Inserted temporary rule, oid = " . $fraud_rule_oid . "\n";

// Now delete it.
$fraud_api->deleteFraudRule($fraud_rule_oid);
echo "Deleted fraud rule oid = " . $fraud_rule_oid . "\n";
