<?php

ini_set('display_errors', 1);

/*
 * establishFraudRulesFromOrder is a shortcut that derives fraud rules from an existing order.
 * Point it at an order you have identified as fraudulent and tell it which attributes of that
 * order to turn into rules: the email, the credit card, the ip address, and/or the address.
 * It creates the matching rules and returns them.  This is the fast way to "block everything
 * associated with this bad order" instead of building each rule by hand.
 *
 * Not every filter produces a rule; the order must actually have that attribute. For example an
 * order with no stored card data will not produce a credit card rule.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

use ultracart\v2\models\FraudRuleFromOrderRequest;

$fraud_api = Samples::getFraudApi();

$request = new FraudRuleFromOrderRequest();
$request->setOrderId('DEMO-0009104434');
$request->setEstablishEmailFilter(true);
$request->setEstablishCardFilter(true);
$request->setEstablishIpFilter(true);
$request->setEstablishAddressFilter(true);
$request->setFailureAction('Flag For Review');
$request->setAutoNote('Established from fraudulent order DEMO-0009104434');

$api_response = $fraud_api->establishFraudRulesFromOrder($request);

$fraud_rules = $api_response->getFraudRules();
echo 'Established ' . count($fraud_rules) . " rule(s) from the order:\n";

foreach ($fraud_rules as $fraud_rule) {
    echo '  oid ' . $fraud_rule->getFraudRuleOid() . ' - ' . $fraud_rule->getRuleType()
        . ' - ' . $fraud_rule->getAutoNote() . "\n";
}
