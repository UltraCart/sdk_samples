import {giftCertificateApi} from '../api';
import {
    AddGiftCertificateLedgerEntryRequest,
    GiftCertificate,
    GiftCertificateLedgerEntry
} from 'ultracart_rest_api_v2_typescript';
import {DateTime} from 'luxon';

export class AddGiftCertificateLedgerEntry {
    public static async execute(): Promise<void> {
        const giftCertificate = await AddGiftCertificateLedgerEntry.addGiftCertificateLedgerEntryCall();
        console.log("Gift Certificate:", giftCertificate);
    }

    public static async addGiftCertificateLedgerEntryCall(): Promise<GiftCertificate|undefined> {
        const giftCertificateOid: number = 676713;

        const ledgerEntry: GiftCertificateLedgerEntry = {
            amount: -15.35,
            description: "Customer bought something over the counter using this gift certificate.",
            entry_dts: DateTime.now().setZone('America/New_York').toISO(),
            gift_certificate_ledger_oid: 0,
            gift_certificate_oid: giftCertificateOid,
            reference_order_id: "BLAH-12345"
        };

        const ledgerRequest: AddGiftCertificateLedgerEntryRequest = {
            giftCertificateOid: giftCertificateOid, giftCertificateLedgerEntry: ledgerEntry
        }
        const gcResponse = await giftCertificateApi.addGiftCertificateLedgerEntry(
            ledgerRequest
        );

        return gcResponse.gift_certificate;
    }
}
