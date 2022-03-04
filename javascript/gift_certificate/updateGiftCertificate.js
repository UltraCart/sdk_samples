var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);

let giftCertificateOid = 676713;


// by_oid does not take an expansion variable.  it will return the entire object by default.
giftCertificateApi.getGiftCertificateByOid(giftCertificateOid, 
    function(error, data, response){
        let giftCertificate = data.gift_certificate;    

        // now update the email
        giftCertificate.email = 'perry@ultracart.com';
        giftCertificateApi.updateGiftCertificate(giftCertificateOid, giftCertificate,
            function(error, data, response){
                let updatedCertificate = data.gift_certificate;    
                console.log('updatedCertificate', updatedCertificate);
            });

    });