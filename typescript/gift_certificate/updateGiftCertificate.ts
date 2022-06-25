// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';
import { GetGiftCertificateByOidRequest, UpdateGiftCertificateRequest } from 'ultracart_rest_api_v2_typescript';



let giftCertificateOid = 676813;


// by_oid does not take an expansion variable.  it will return the entire object by default.
let getGiftCertificateByOidRequest: GetGiftCertificateByOidRequest = {
    giftCertificateOid: giftCertificateOid
};
let gcResponse = await giftCertificateApi.getGiftCertificateByOid(getGiftCertificateByOidRequest);
let giftCertificate = gcResponse.gift_certificate;

if(giftCertificate){
    giftCertificate.email = 'perry@ultracart.com';
    let updateGiftCertificateRequest: UpdateGiftCertificateRequest = {
        giftCertificateOid: giftCertificateOid,
        giftCertificate: giftCertificate
    };

    gcResponse = await giftCertificateApi.updateGiftCertificate(updateGiftCertificateRequest);
    giftCertificate = gcResponse.gift_certificate;
            
    console.log(giftCertificate);
    
} else {
    console.log('Gift certificate was not found on the UltraCart system.  Perhaps you are running a demo and have not created a certificate yet?  Be sure to change the giftCertificateOid to your own cert.');
}
