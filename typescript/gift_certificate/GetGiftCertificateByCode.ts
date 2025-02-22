import { giftCertificateApi } from '../api';
import { GiftCertificate } from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificateByCode {
    public static async execute(): Promise<void> {
        const giftCertificate = await this.getGiftCertificateByCodeCall();
        console.log(giftCertificate, "Gift Certificate");
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async getGiftCertificateByCodeCall(): Promise<GiftCertificate|undefined> {
        const api = giftCertificateApi;
        
        const code: string = "X8PV761V2Z";

        // by_code does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await api.getGiftCertificateByCode({code:code});
        return gcResponse.gift_certificate;
    }
}