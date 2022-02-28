// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';

import { GiftCertificateLedgerEntry } from 'ultracart_rest_api_v2_typescript';
import { DateTime } from 'luxon';


let giftCertificateOid = 676813;

let ledgerEntry: GiftCertificateLedgerEntry = {};

ledgerEntry.amount = -65.35;  // this is the change amount in the gift certificate.  this is not a balance.  it will be subtracted from it.
ledgerEntry.description = "Customer bought something over the counter using this gift certificate.";
ledgerEntry.entry_dts = DateTime.now().setZone('America/New_York').toISO();
ledgerEntry.gift_certificate_ledger_oid = 0;  // the system will assign an oid.  do not assign one here.
ledgerEntry.gift_certificate_oid = giftCertificateOid  // this is an existing gift certificate oid.  I created it using createGiftCertificate.ts
ledgerEntry.reference_order_id = 'BLAH-12345'; // if this ledger entry is related to an order, add it here, else use null.


// add ledger entry method does not take an expansion variable.  it will return the entire object by default.
let gcResponse = await giftCertificateApi.addGiftCertificateLedgerEntry(giftCertificateOid, ledgerEntry);
let giftCertificate = gcResponse.gift_certificate;

console.log(giftCertificate);