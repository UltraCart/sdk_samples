import {DateTime} from 'luxon';
import {giftCertificateApi} from '../api.js';

export class CreateGiftCertificate {
    static async execute() {
        const giftCertificate = await CreateGiftCertificate.createGiftCertificateCall();
        console.log("Gift Certificate:", giftCertificate);
    }

    static async createGiftCertificateCall() {

        const giftCertificateCreateRequest = {
            amount: 200.00,
            initial_ledger_description: "Created via TypeScript SDK",
            merchant_note: "Internal comment here",
            email: "support@ultracart.com",
            expiration_dts: DateTime.now()
                .setZone('America/New_York')
                .plus({months: 3})
                .toISO()
        };

        const request = {
            giftCertificateCreateRequest: giftCertificateCreateRequest
        };

        // create does not take an expansion variable.  it will return the entire object by default.
        const gcResponse = await new Promise((resolve, reject) => {
            giftCertificateApi.createGiftCertificate(request, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });
        return gcResponse.gift_certificate;
    }
}

export default CreateGiftCertificate;