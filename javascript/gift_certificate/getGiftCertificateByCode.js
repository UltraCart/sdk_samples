import { giftCertificateApi } from '../api.js';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificateByCode {
    static async execute() {
        const giftCertificate = await this.getGiftCertificateByCodeCall();
        console.log(giftCertificate, "Gift Certificate");
    }

    // ReSharper disable once MemberCanBePrivate.Global
    static async getGiftCertificateByCodeCall() {
        const api = giftCertificateApi;
        
        const code = "X8PV761V2Z";

        // by_code does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await new Promise((resolve, reject) => {
            api.getGiftCertificateByCode(code, function(error, data, response) {
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