// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';


let code = 'NRQPHPCFVK'

// by_code does not take an expansion variable.  it will return the entire object by default.
let gcResponse = await giftCertificateApi.getGiftCertificateByCode(code);
let giftCertificate = gcResponse.gift_certificate;

console.log(giftCertificate);
