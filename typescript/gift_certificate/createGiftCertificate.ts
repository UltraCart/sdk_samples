// I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
import { giftCertificateApi } from '../api.js';
// import { giftCertificateApi } from '../api';

import { CreateGiftCertificateRequest, GiftCertificateCreateRequest } from 'ultracart_rest_api_v2_typescript';
import { DateTime } from 'luxon';


let gcCreateRequest: GiftCertificateCreateRequest = {};
gcCreateRequest.amount = 150.75;
gcCreateRequest.initial_ledger_description = "Issued instead of refund";
gcCreateRequest.merchant_note = 'Problem Order: blah-12345\nIssued gift certificate due to stale product.\nIssued By: Customer Service Rep Joe Smith';
gcCreateRequest.email = 'support@ultracart.com';
gcCreateRequest.expiration_dts = DateTime.now().setZone('America/New_York').plus({months:3}).endOf('day').toISO();

let createGiftCertificateRequest: CreateGiftCertificateRequest = {
    giftCertificateCreateRequest: gcCreateRequest
};


// create does not take an expansion variable.  it will return the entire object by default.
let gcResponse = await giftCertificateApi.createGiftCertificate(createGiftCertificateRequest);
let giftCertificate = gcResponse.gift_certificate;

console.log(giftCertificate);
