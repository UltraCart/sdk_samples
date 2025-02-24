import { giftCertificateApi } from '../api.js';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificatesByQuery {
    static async execute() {
        const giftCertificates = await this.getGiftCertificateByQueryCall();
        if(giftCertificates !== undefined) {
            for (const giftCertificate of giftCertificates) {
                // Assuming Utility is available in your TS environment
                console.log(giftCertificate);
            }
        }
    }

    static async getGiftCertificateChunk(api, offset, limit) {
        const expansion = "ledger";

        // leaving query empty, so no filtering, and I should get all records returned.
        const query = {};

        const gcResponse = await new Promise((resolve, reject) => {
            api.getGiftCertificatesByQuery(
                query, {_limit: limit, _offset: offset, _expand: expansion},
                function(error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        if (gcResponse !== undefined && gcResponse.success === true && gcResponse.gift_certificates !== null) {
            return gcResponse.gift_certificates;
        }

        return [];
    }

    // ReSharper disable once MemberCanBePrivate.Global
    static async getGiftCertificateByQueryCall() {
        const api = giftCertificateApi;

        const giftCertificates = [];

        let iteration = 1;
        let offset = 0;
        const limit = 200;
        let moreRecordsToFetch = true;

        while (moreRecordsToFetch) {
            console.log(`executing iteration ${iteration}`);
            const chunkOfCertificates = await this.getGiftCertificateChunk(api, offset, limit);
            if(chunkOfCertificates !== undefined && chunkOfCertificates !== null) {
                giftCertificates.push(...chunkOfCertificates);
                offset += limit;
                moreRecordsToFetch = chunkOfCertificates.length === limit;
                iteration++;
            } else {
                moreRecordsToFetch = false;
            }
        }

        return giftCertificates;
    }
}