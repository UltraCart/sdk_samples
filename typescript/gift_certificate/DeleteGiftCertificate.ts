import { giftCertificateApi } from '../api';
import {DeleteGiftCertificateRequest, GiftCertificate, GetGiftCertificateByOidRequest} from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class DeleteGiftCertificate {
    public static async execute(): Promise<void> {
        const giftCertificate = await this.deleteGiftCertificateCall();
        // Assuming Utility is available in your TS environment
        console.debug(giftCertificate, "Gift Certificate");
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async deleteGiftCertificateCall(): Promise<GiftCertificate|undefined> {
        const api = giftCertificateApi;
        
        const giftCertificateOid: number = 676713;
        const deleteGiftCertificateRequest: DeleteGiftCertificateRequest = {giftCertificateOid: giftCertificateOid};
        await api.deleteGiftCertificate(deleteGiftCertificateRequest);

        // if I re-query the gift certificate after deleting, I will still get an object back, but the
        // deleted flag on the object will be true.
        // by_oid does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await api.getGiftCertificateByOid({giftCertificateOid: giftCertificateOid});
        return gcResponse.gift_certificate;
    }
}