<?php

use ultracart\v2\models\GiftCertificateCreateRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$gift_certificate_api = ultracart\v2\api\GiftCertificateApi::usingApiKey(Constants::API_KEY);

$gift_certificate_oid = 676813;

$entry_dts = new DateTime('now');

$ledger_entry = new \ultracart\v2\models\GiftCertificateLedgerEntry();
$ledger_entry->setAmount(-10.15); // this is the change amount in the gift certificate.  this is not a balance.  it will be subtracted from it.
$ledger_entry->setDescription("Customer bought something over the counter");
$ledger_entry->setReferenceOrderId('BLAH-12345'); // if this ledger entry is related to an order, add it here, else use null.
$ledger_entry->setEntryDts($entry_dts->format('c')); // Must be ISO8601 format
$ledger_entry->setGiftCertificateLedgerOid(0);  // the system will assign an oid.  do not assign one here.
$ledger_entry->setGiftCertificateOid($gift_certificate_oid);  // this is an existing gift certificate oid.  I created it using createGiftCertificate.ts


// ledger entry does not take an expansion variable.  it will return the entire object by default.
$api_response = $gift_certificate_api->addGiftCertificateLedgerEntry($gift_certificate_oid, $ledger_entry);

echo '<html lang="en"><body><pre>';
var_dump($api_response);
var_dump($api_response->getGiftCertificate());
echo '</pre></body></html>';


