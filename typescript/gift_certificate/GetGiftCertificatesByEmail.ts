import { giftCertificateApi } from '../api';
import { GiftCertificate } from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificatesByEmail {
    public static async execute(): Promise<void> {
        const giftCertificates = await this.getGiftCertificatesByEmailCall();
        if(giftCertificates != undefined) {
            for (const gc of giftCertificates) {
                console.log(gc);
            }
        }
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async getGiftCertificatesByEmailCall(): Promise<GiftCertificate[]|undefined> {
        const api = giftCertificateApi;
        
        const email: string = "support@ultracart.com";

        // by_email does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await api.getGiftCertificatesByEmail({email: email});
        return gcResponse.gift_certificates;
    }
}
