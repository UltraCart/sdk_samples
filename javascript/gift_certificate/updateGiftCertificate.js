import { giftCertificateApi } from '../api.js';

// ReSharper disable once ClassNeverInstantiated.Global
export class UpdateGiftCertificate {
    static async execute() {
        const giftCertificate = await this.updateGiftCertificateCall();
        console.log(giftCertificate);
    }

    // ReSharper disable once MemberCanBePrivate.Global
    static async updateGiftCertificateCall() {
        const api = giftCertificateApi;
        
        const giftCertificateOid = 676713;
        
        const gcResponse = await new Promise((resolve, reject) => {
            api.getGiftCertificateByOid({giftCertificateOid: giftCertificateOid}, function(error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });

        if(gcResponse.gift_certificate !== undefined) {
            const giftCertificate = gcResponse.gift_certificate;
            giftCertificate.email = "perry@ultracart.com";

            // update does not take an expansion variable.  it will return the entire object by default.
            const updatedResponse = await new Promise((resolve, reject) => {
                api.updateGiftCertificate(
                    giftCertificateOid, giftCertificate,
                    function(error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    }
                );
            });

            return updatedResponse.gift_certificate;
        }
        // handle this condition somehow.
        return undefined;
    }
}