var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');
var luxon = require('luxon');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);


let gcCreateRequest = new ucApi.GiftCertificateCreateRequest();
gcCreateRequest.amount = 150.75;
gcCreateRequest.initial_ledger_description = "Issued instead of refund";
gcCreateRequest.merchant_note = 'Problem Order: blah-12345\nIssued gift certificate due to stale product.\nIssued By: Customer Service Rep Joe Smith';
gcCreateRequest.email = 'support@ultracart.com';
gcCreateRequest.expiration_dts = luxon.DateTime.now().setZone('America/New_York').plus({months:3}).endOf('day').toISO();


// create does not take an expansion variable.  it will return the entire object by default.
giftCertificateApi.createGiftCertificate(gcCreateRequest, 
    function(error, data, response){
        let giftCertificate = data.gift_certificate;    
        console.log('giftCertificate', giftCertificate);
    });