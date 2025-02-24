import {orderApi} from '../api.js';

/**
 * getOrderEdiDocuments returns back all EDI documents associated with an order.
 *
 * Possible Errors:
 * Order.channelPartnerOid is null -> "Order is not associated with an EDI channel partner."
 */
export async function execute() {
    const orderId = "DEMO-0009104976";

    try {
        const response = await new Promise((resolve, reject) => {
            orderApi.getOrderEdiDocuments(
                orderId
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        const documents = response.ediDocuments || [];

        for (const doc of documents) {
            console.log(JSON.stringify(doc, null, 2));
        }
    } catch (error) {
        console.error('Error fetching EDI documents:', error);
    }
}