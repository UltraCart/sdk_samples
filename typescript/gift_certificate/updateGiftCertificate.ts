// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';


let giftCertificateOid = 676813;


// by_oid does not take an expansion variable.  it will return the entire object by default.
let gcResponse = await giftCertificateApi.getGiftCertificateByOid(giftCertificateOid);
let giftCertificate = gcResponse.gift_certificate;

if(giftCertificate){
    giftCertificate.email = 'perry@ultracart.com';

    gcResponse = await giftCertificateApi.updateGiftCertificate(giftCertificateOid, giftCertificate);
    giftCertificate = gcResponse.gift_certificate;
            
    console.log(giftCertificate);
    
} else {
    console.log('Gift certificate was not found on the UltraCart system.  Perhaps you are running a demo and have not created a certificate yet?  Be sure to change the giftCertificateOid to your own cert.');
}
