import { DateTime } from 'luxon';
import { giftCertificateApi } from '../api';
import {
    CreateGiftCertificateRequest,
    GiftCertificate,
    GiftCertificateCreateRequest
} from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class CreateGiftCertificate {
    public static execute(): void {
        const giftCertificate = CreateGiftCertificate.createGiftCertificateCall();
        console.log("Gift Certificate:", giftCertificate);
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async createGiftCertificateCall(): Promise<GiftCertificate|undefined> {
        const api = giftCertificateApi;

        const giftCertificateCreateRequest: GiftCertificateCreateRequest = {
            amount: 200.00,
            initial_ledger_description: "Created via TypeScript SDK",
            merchant_note: "Internal comment here",
            email: "support@ultracart.com",
            expiration_dts: DateTime.now()
                .setZone('America/New_York')
                .plus({ months: 3 })
                .toISO()
        };

        const request: CreateGiftCertificateRequest = {
            giftCertificateCreateRequest: giftCertificateCreateRequest
        };

        // create does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await api.createGiftCertificate(request)
        return gcResponse.gift_certificate;
    }
}