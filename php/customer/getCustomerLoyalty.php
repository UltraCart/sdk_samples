<?php

use ultracart\v2\ApiException;
use ultracart\v2\models\AdjustLoyaltyPointsRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

/*
    getCustomerLoyalty returns the loyalty information for a single customer, which includes:
    currentPoints - vested points the customer can spend right now
    pendingPoints - points that carry a vesting date still in the future
    ledgerEntries - the full points ledger, the append only history behind those two numbers
    redemptions - rewards the customer has already redeemed
    loyaltyTierOid / loyaltyTierName / loyaltyTierExpirationDts - the customer's tier, if any
    internalGiftCertificate - cashback balance, for merchants running a cashback program

    This is a convenience method.  It returns the same object you get by expanding 'loyalty' on the
    customer, but without retrieving the entire customer record.  Use it to refresh loyalty numbers
    after calling adjustLoyaltyPoints().
 */

try {

    $customer_api = Samples::getCustomerApi();

    // create a customer
    $customer_oid = insertSampleCustomer();

    // give them some points so the ledger below is not empty.
    $adjustRequest = new AdjustLoyaltyPointsRequest();
    $adjustRequest->setLoyaltyPoints(750);
    $adjustRequest->setDescription('Welcome bonus');
    $adjustRequest->setVestingDays(0);
    $customer_api->adjustLoyaltyPoints($customer_oid, $adjustRequest);


    $api_response = $customer_api->getCustomerLoyalty($customer_oid);
    $loyalty = $api_response->getCustomerLoyalty();

    echo 'Current Points: ' . $loyalty->getCurrentPoints() . "\n";
    echo 'Pending Points: ' . $loyalty->getPendingPoints() . "\n";

    // The ledger is the source of truth.  currentPoints and pendingPoints are just sums of it.
    foreach ($loyalty->getLedgerEntries() as $entry) {
        echo $entry->getLedgerDts() . ' | '
            . $entry->getLoyaltyPoints() . ' points | '
            . $entry->getCreatedBy() . ' | '
            . $entry->getDescription() . "\n";
    }

    var_dump($loyalty); // <-- There's a lot of information inside this object.

    // clean up this sample.
    deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
