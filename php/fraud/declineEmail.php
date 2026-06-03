<?php

ini_set('display_errors', 1);

/*
 * declineEmail is a shortcut for telling UltraCart to decline orders from a specific email
 * address.  It is the quick alternative to building a full "address email" fraud rule by hand.
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

use ultracart\v2\models\FraudDeclineEmailRequest;

$fraud_api = Samples::getFraudApi();

$decline_request = new FraudDeclineEmailRequest();
$decline_request->setEmail('chargeback-charlie@example.com');

$fraud_api->declineEmail($decline_request);

echo "Declined email: " . $decline_request->getEmail() . "\n";
