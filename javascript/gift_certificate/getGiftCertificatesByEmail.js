import { giftCertificateApi } from '../api.js';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificatesByEmail {
    static async execute() {
        const giftCertificates = await this.getGiftCertificatesByEmailCall();
        if(giftCertificates !== undefined) {
            for (const gc of giftCertificates) {
                console.log(gc);
            }
        }
    }

    // ReSharper disable once MemberCanBePrivate.Global
    static async getGiftCertificatesByEmailCall() {
        const api = giftCertificateApi;
        
        const email = "support@ultracart.com";

        // by_email does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await new Promise((resolve, reject) => {
            api.getGiftCertificatesByEmail(email, function(error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        return gcResponse.gift_certificates;
    }
}