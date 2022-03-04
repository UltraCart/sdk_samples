var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');
var luxon = require('luxon');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);

let giftCertificateOid = 676813;
let ledgerEntry = new ucApi.GiftCertificateLedgerEntry();

ledgerEntry.amount = -65.35;  // this is the change amount in the gift certificate.  this is not a balance.  it will be subtracted from it.
ledgerEntry.description = "Customer bought something over the counter using this gift certificate.";
ledgerEntry.entry_dts = luxon.DateTime.now().setZone('America/New_York').toISO();
ledgerEntry.gift_certificate_ledger_oid = 0;  // the system will assign an oid.  do not assign one here.
ledgerEntry.gift_certificate_oid = giftCertificateOid  // this is an existing gift certificate oid.  I created it using createGiftCertificate.ts
ledgerEntry.reference_order_id = 'BLAH-12345'; // if this ledger entry is related to an order, add it here, else use null.


// add ledger entry does not take an expansion variable.  it will return the entire object by default.
let gcResponse = giftCertificateApi.addGiftCertificateLedgerEntry(giftCertificateOid, ledgerEntry, 
    function(error, data, response){
        let giftCertificate = data.gift_certificate;    
        console.log('giftCertificate', giftCertificate);
    });