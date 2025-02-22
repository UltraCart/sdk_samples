import { giftCertificateApi } from '../api';
import { GiftCertificate } from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class UpdateGiftCertificate {
    public static async execute(): Promise<void> {
        const giftCertificate = await this.updateGiftCertificateCall();
        console.log(giftCertificate);
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async updateGiftCertificateCall(): Promise<GiftCertificate|undefined> {
        const api = giftCertificateApi;
        
        const giftCertificateOid: number = 676713;
        
        const gcResponse = await api.getGiftCertificateByOid({giftCertificateOid:giftCertificateOid});
        if(gcResponse.gift_certificate !== undefined) {
            const giftCertificate: GiftCertificate = gcResponse.gift_certificate;
            giftCertificate.email = "perry@ultracart.com";

            // update does not take an expansion variable.  it will return the entire object by default.
            const updatedResponse = await api.updateGiftCertificate({giftCertificateOid: giftCertificateOid, giftCertificate: giftCertificate});
            return updatedResponse.gift_certificate;
        }
        // handle this condition somehow.
        return undefined;
    }
}