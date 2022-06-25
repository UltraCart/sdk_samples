// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { DeleteGiftCertificateRequest, GetGiftCertificateByOidRequest } from 'ultracart_rest_api_v2_typescript';
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';


let giftCertificateOid = 676713;


const deleteGiftCertificateRequest: DeleteGiftCertificateRequest = {
    giftCertificateOid: giftCertificateOid
}
await giftCertificateApi.deleteGiftCertificate(deleteGiftCertificateRequest);

// if I query the gift certificate now, it will still return as a valid object, but the deleted flag will be true.
const getGiftCertificateByOidRequest: GetGiftCertificateByOidRequest = {
    giftCertificateOid: giftCertificateOid
};
let gcResponse = await giftCertificateApi.getGiftCertificateByOid(getGiftCertificateByOidRequest);
let giftCertificate = gcResponse.gift_certificate;

console.log(giftCertificate);
