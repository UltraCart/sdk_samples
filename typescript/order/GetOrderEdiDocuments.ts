import { orderApi } from '../api';
import {
    OrderEdiDocumentsResponse,
    OrderEdiDocument
} from 'ultracart_rest_api_v2_typescript';

/**
 * getOrderEdiDocuments returns back all EDI documents associated with an order.
 *
 * Possible Errors:
 * Order.channelPartnerOid is null -> "Order is not associated with an EDI channel partner."
 */
export async function execute(): Promise<void> {
    const orderId = "DEMO-0009104976";

    try {
        const response: OrderEdiDocumentsResponse = await orderApi.getOrderEdiDocuments({
            orderId: orderId
        });

        const documents: OrderEdiDocument[] = response.ediDocuments || [];

        for (const doc of documents) {
            console.log(JSON.stringify(doc, null, 2));
        }
    } catch (error) {
        console.error('Error fetching EDI documents:', error);
    }
}