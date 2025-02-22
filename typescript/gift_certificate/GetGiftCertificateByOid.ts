import { giftCertificateApi } from '../api';
import { GiftCertificate } from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificateByOid {
    public static async execute(): Promise<void> {
        const giftCertificate = await this.getGiftCertificateByOidCall();
        console.log(giftCertificate, "Gift Certificate");
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async getGiftCertificateByOidCall(): Promise<GiftCertificate|undefined> {
        const api = giftCertificateApi;
        
        const giftCertificateOid: number = 676713;

        // by_oid does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await api.getGiftCertificateByOid({giftCertificateOid:giftCertificateOid});
        return gcResponse.gift_certificate;
    }
}
