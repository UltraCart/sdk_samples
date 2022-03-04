var ucApi = require('ultra_cart_rest_api_v2');
const { apiClient } = require('../api.js');

var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);

let giftCertificateOid = 676713;

giftCertificateApi.deleteGiftCertificate(giftCertificateOid, function(error, data, response){

    // requery the gift certificate and an object is still returned, even after deleting.
    // However, the object's deleted property will now be true.
    // by_oid does not take an expansion variable.  it will return the entire object by default.
    giftCertificateApi.getGiftCertificateByOid(giftCertificateOid, 
        function(error, data, response){
            let giftCertificate = data.gift_certificate;    
            console.log('giftCertificate', giftCertificate);
        });

});


