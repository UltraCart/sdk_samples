import { giftCertificateApi } from '../api';
import {GiftCertificate, GiftCertificateApi, GiftCertificateQuery} from 'ultracart_rest_api_v2_typescript';

// ReSharper disable once ClassNeverInstantiated.Global
export class GetGiftCertificatesByQuery {
    public static async execute(): Promise<void> {
        const giftCertificates = await this.getGiftCertificateByQueryCall();
        if(giftCertificates !== undefined) {
            for (const giftCertificate of giftCertificates) {
                // Assuming Utility is available in your TS environment
                console.log(giftCertificate);
            }
        }
    }

    private static async getGiftCertificateChunk(api: GiftCertificateApi, offset: number, limit: number): Promise<GiftCertificate[]|undefined> {
        const expansion: string = "ledger";

        // leaving query empty, so no filtering, and I should get all records returned.
        const query: GiftCertificateQuery = {};

        const gcResponse = await api.getGiftCertificatesByQuery({giftCertificateQuery: query, limit:limit, offset:offset, expand:expansion});
        if (gcResponse !== undefined && gcResponse.success === true && gcResponse.gift_certificates !== null) {
            return gcResponse.gift_certificates;
        }

        return [];
    }

    // ReSharper disable once MemberCanBePrivate.Global
    public static async getGiftCertificateByQueryCall(): Promise<GiftCertificate[]|undefined> {
        const api = giftCertificateApi;

        const giftCertificates: GiftCertificate[] = [];

        let iteration: number = 1;
        let offset: number = 0;
        const limit: number = 200;
        let moreRecordsToFetch: boolean = true;

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