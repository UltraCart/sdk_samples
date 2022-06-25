var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);

var giftCertificates = [];
var offset = 0;
var limit = 200;

function finished(){
    console.log('giftCertificates', giftCertificates);
    console.log("count of certificates: ", giftCertificates.length);
}

function getGiftCertificateChunk(){
    let expansion = 'ledger';
    let query = new ucApi.GiftCertificateQuery(); // leaving this empty, so no filtering, and I should get all records returned.
    giftCertificateApi.getGiftCertificatesByQuery(query, { _limit: limit, _offset: offset, _expand: expansion }, function(error, data, response){
        if(data && data.gift_certificates){
            giftCertificates = giftCertificates.concat(data.gift_certificates);

            offset = offset + limit;
            if(data.gift_certificates.length == limit){
                getGiftCertificateChunk();
            } else {
                finished();
            }
        } else {
            finished();
        }
    });
}

getGiftCertificateChunk();
