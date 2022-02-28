// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';


let giftCertificateOid = 676713;


await giftCertificateApi.deleteGiftCertificate(giftCertificateOid);

// if I query the gift certificate now, it will still return as a valid object, but the deleted flag will be true.
let gcResponse = await giftCertificateApi.getGiftCertificateByOid(giftCertificateOid);
let giftCertificate = gcResponse.gift_certificate;

console.log(giftCertificate);
