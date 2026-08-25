<?php

use ultracart\v2\ApiException;
use ultracart\v2\models\AdjustLoyaltyPointsRequest;

require_once '../vendor/autoload.php';
require_once '../samples.php';
require_once './customer_functions.php'; // <-- see this file for details

/*
    adjustLoyaltyPoints adds a record to a customer's loyalty points ledger.

    Loyalty points are not a field you can edit on the customer object.  They are the running sum of a
    ledger, so the loyalty properties on Customer are read only.  This method is how you change them.

    The ledger is append only.  Records are never updated or deleted.  To correct a mistake, post a
    second adjustment with the opposite sign.  Both entries remain in the ledger as an audit trail.

    This method is for merchants running a POINTS loyalty program.  If you run a CASHBACK program,
    call adjustInternalCertificate() instead.  Calling this method on a cashback account returns an error.

    Possible Errors:
    Merchant has no loyalty program -> "This merchant is not setup for Loyalty so no adjustments can be made..."
    Merchant runs cashback, not points -> "This merchant is running a cashback loyalty program, not a points program..."
    Missing points -> "adjust_loyalty_points_request.loyalty_points is required and was missing"
    Zero points -> "adjust_loyalty_points_request.loyalty_points may not be zero"
 */

try {

    $customer_api = Samples::getCustomerApi();

    // create a customer
    $customer_oid = insertSampleCustomer();

    // Credit points that are usable right away.
    $creditRequest = new AdjustLoyaltyPointsRequest();
    $creditRequest->setLoyaltyPoints(500);
    $creditRequest->setDescription('Customer called to complain about a late shipment.');
    $creditRequest->setVestingDays(0); // 0 means immediately available.  null means use the merchant default.
    $creditRequest->setOrderId(null);  // or supply an order id to tie the adjustment to a particular order.

    $api_response = $customer_api->adjustLoyaltyPoints($customer_oid, $creditRequest);

    echo 'Adjustment: ' . $api_response->getLoyaltyPoints() . "\n";
    echo 'Current Points: ' . $api_response->getCurrentPoints() . "\n";
    echo 'Pending Points: ' . $api_response->getPendingPoints() . "\n";


    // Credit points that have to vest before the customer can spend them.  Points carrying a vesting
    // date count toward pending_points, not current_points, until that date passes.
    $vestingRequest = new AdjustLoyaltyPointsRequest();
    $vestingRequest->setLoyaltyPoints(250);
    $vestingRequest->setDescription('Promotional bonus, vests in 30 days.');
    $vestingRequest->setVestingDays(30);

    $api_response = $customer_api->adjustLoyaltyPoints($customer_oid, $vestingRequest);

    echo 'Adjustment: ' . $api_response->getLoyaltyPoints() . "\n";
    echo 'Current Points: ' . $api_response->getCurrentPoints() . "\n";
    echo 'Pending Points: ' . $api_response->getPendingPoints() . "\n"; // <-- the 250 lands here, not in current


    // Debit points by sending a negative number.  This does not delete the credits above.  It writes a
    // third ledger record for -100.  Note the balance is allowed to go negative if you debit more than
    // the customer has, so validate the amount yourself if that matters to you.
    $debitRequest = new AdjustLoyaltyPointsRequest();
    $debitRequest->setLoyaltyPoints(-100);
    $debitRequest->setDescription('Correcting a duplicate credit issued earlier.');
    $debitRequest->setVestingDays(0);

    $api_response = $customer_api->adjustLoyaltyPoints($customer_oid, $debitRequest);

    echo 'Adjustment: ' . $api_response->getLoyaltyPoints() . "\n";
    echo 'Current Points: ' . $api_response->getCurrentPoints() . "\n";
    echo 'Pending Points: ' . $api_response->getPendingPoints() . "\n";

    var_dump($api_response);

    // clean up this sample.
    deleteSampleCustomer($customer_oid);

} catch (ApiException $e) {
    echo 'An ApiException occurred.  Please review the following error:';
    var_dump($e); // <-- change_me: handle gracefully
    die(1);
}
