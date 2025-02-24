import { giftCertificateApi } from '../api.js';

export class DeleteGiftCertificate {
    static async execute() {
        const giftCertificate = await this.deleteGiftCertificateCall();
        console.debug(giftCertificate, "Gift Certificate");
    }

    static async deleteGiftCertificateCall() {
        const api = giftCertificateApi;

        const giftCertificateOid = 676713;

        // Wrap the delete call in a Promise
        await new Promise((resolve, reject) => {
            api.deleteGiftCertificate(giftCertificateOid, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });


        // if I re-query the gift certificate after deleting, I will still get an object back, but the
        // deleted flag on the object will be true.
        // by_oid does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await new Promise((resolve, reject) => {
            api.getGiftCertificateByOid(giftCertificateOid, function (error, data, response) {
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
