var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);

let code = 'NRQPHPCFVK';


// by_code does not take an expansion variable.  it will return the entire object by default.
giftCertificateApi.getGiftCertificateByCode(code, 
    function(error, data, response){
        let giftCertificate = data.gift_certificate;    
        console.log('giftCertificate', giftCertificate);
    });