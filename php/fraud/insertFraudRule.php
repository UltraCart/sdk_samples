<?php

ini_set('display_errors', 1);

/*
 * insertFraudRule creates a single fraud rule.  Each rule has a rule_type (what it inspects),
 * a failure_action (what happens when it matches), and type-specific fields such as an amount
 * threshold, country code, ip address, or email.
 *
 * This sample has some fun and inserts several rules of different types in one run.  Call
 * getFraudLookupValues.php to see every valid rule_type and the other lookup values.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

use ultracart\v2\models\FraudRuleInsertRequest;

$fraud_api = Samples::getFraudApi();

// Build a handful of rules covering different rule types.
$rules = [];

// 1. Decline any order placed with a known-bad email address.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('address email');
$rule->setEmail('chargeback-charlie@example.com');
$rule->setFailureAction('Decline Transaction');
$rule->setAutoNote('Known chargeback email - decline on sight');
$rules[] = $rule;

// 2. Flag large single credit card transactions over $1,000 for manual review.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('credit card single transaction exceeds');
$rule->setAmountThreshold(1000.00);
$rule->setFailureAction('Flag For Review');
$rule->setAutoNote('Large single transaction - review before shipping');
$rules[] = $rule;

// 3. Decline orders that ship outside the United States.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('address not in country');
$rule->setCountryCode('US');
$rule->setFailureAction('Decline Transaction');
$rule->setAutoNote('Domestic shipping only');
$rules[] = $rule;

// 4. Decline transactions originating from a specific bad IP address.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('ip matches');
$rule->setIpAddress('203.0.113.66');
$rule->setIpRangeType('address');
$rule->setFailureAction('Decline Transaction');
$rule->setAutoNote('Blocked IP address');
$rules[] = $rule;

// 5. Flag prepaid credit cards for review.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('credit card block prepaid');
$rule->setFailureAction('Flag For Review');
$rule->setAutoNote('Prepaid card - take a closer look');
$rules[] = $rule;

// 6. Flag a customer IP making more than 10 transactions in a single day.
$rule = new FraudRuleInsertRequest();
$rule->setRuleType('ip daily transaction count exceeds');
$rule->setCountThreshold(10);
$rule->setIpRangeType('address');
$rule->setUserAction('Attempted');
$rule->setFailureAction('Flag For Review');
$rule->setAutoNote('IP velocity - more than 10 orders in a day');
$rules[] = $rule;

foreach ($rules as $rule) {
    $api_response = $fraud_api->insertFraudRule($rule);
    $created = $api_response->getFraudRule();
    echo "Inserted '" . $rule->getRuleType() . "' rule, oid = " . $created->getFraudRuleOid() . "\n";
}
