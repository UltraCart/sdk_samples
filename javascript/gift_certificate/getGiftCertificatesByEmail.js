var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);

let email = 'support@ultracart.com';


// by_email does not take an expansion variable.  it will return the entire object by default.
giftCertificateApi.getGiftCertificatesByEmail(email, 
    function(error, data, response){
        let giftCertificates = data.gift_certificates;    
        console.log('giftCertificates', giftCertificates);
    });