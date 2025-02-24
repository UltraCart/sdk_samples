import { giftCertificateApi } from '../api.js';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificateByOid {
    static async execute() {
        const giftCertificate = await this.getGiftCertificateByOidCall();
        console.log(giftCertificate, "Gift Certificate");
    }

    // ReSharper disable once MemberCanBePrivate.Global
    static async getGiftCertificateByOidCall() {
        const api = giftCertificateApi;
        
        const giftCertificateOid = 676713;

        // by_oid does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await new Promise((resolve, reject) => {
            api.getGiftCertificateByOid(giftCertificateOid, function(error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        return gcResponse.gift_certificate;
    }
}