// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';


let email = 'support@ultracart.com';

// by_email does not take an expansion variable.  it will return the entire object by default.
let gcResponse = await giftCertificateApi.getGiftCertificatesByEmail(email);
let giftCertificates = gcResponse.gift_certificates;

console.log(giftCertificates);
