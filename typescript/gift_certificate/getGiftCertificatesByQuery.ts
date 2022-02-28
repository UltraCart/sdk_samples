// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';

import { GiftCertificate, GiftCertificateQuery } from 'ultracart_rest_api_v2_typescript';
import { unwatchFile } from 'fs';

let expansion = 'ledger';

async function getGiftCertificateChunk(offset: number = 0, limit: number = 200): Promise<GiftCertificate[]>{
    let query: GiftCertificateQuery = {}; // leaving this empty, so no filtering, and I should get all records returned.
    let gcResponse = await giftCertificateApi.getGiftCertificatesByQuery(query, limit, offset, undefined, undefined, expansion);
    if(gcResponse.success && gcResponse.gift_certificates !== undefined){
        return gcResponse.gift_certificates;
    }
    return [];
}

let giftCertificates: GiftCertificate[] = [];

let iteration = 1;
let offset = 0;
let limit = 200;
let moreRecordsToFetch = true;

while( moreRecordsToFetch ){

    console.log("executing iteration " + iteration);
    let chuckOfCertificates = await getGiftCertificateChunk(offset, limit);
    giftCertificates = giftCertificates.concat(chuckOfCertificates);
    offset = offset + limit
    moreRecordsToFetch = chuckOfCertificates.length === limit;
    iteration = iteration + 1

}

// console.log(giftCertificates);
giftCertificates.forEach(gc => {
    console.log('oid: ' + gc.gift_certificate_oid + ", code: " + gc.code);
});