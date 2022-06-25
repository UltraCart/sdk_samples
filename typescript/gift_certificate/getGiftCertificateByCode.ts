// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
import { GetGiftCertificateByCodeRequest} from 'ultracart_rest_api_v2_typescript';


let code = 'NRQPHPCFVK'

// by_code does not take an expansion variable.  it will return the entire object by default.
const getGiftCertificateByCodeRequest: GetGiftCertificateByCodeRequest = { code: code};
let gcResponse = await giftCertificateApi.getGiftCertificateByCode(getGiftCertificateByCodeRequest);
let giftCertificate = gcResponse.gift_certificate;

console.log(giftCertificate);
