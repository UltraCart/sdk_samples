import {DateTime} from 'luxon';
import {orderApi} from '../api.js';

/**
 * This example illustrates how to query the OrderQuery object to select a range of records. It uses a subroutine
 * to aggregate the records that span multiple API calls. This example illustrates a work-around to selecting
 * all rejected orders. Because the UltraCart SDK does not have a way to query orders based on whether they
 * were rejected, we can instead query based on the rejected_dts, which is null if the order is not rejected.
 * So we will simply use a large time frame to ensure we query all rejections.
 */
export class GetOrdersByQuery {
    /**
     * Execute the order query and retrieve orders
     */
    static async execute() {
        const orders = [];

        let iteration = 1;
        let offset = 0;
        const limit = 200;
        let moreRecordsToFetch = true;

        while (moreRecordsToFetch) {
            console.log(`executing iteration ${iteration}<br>`);
            const chunkOfOrders = await this.getOrderChunk(offset, limit);
            orders.push(...chunkOfOrders);
            offset = offset + limit;
            moreRecordsToFetch = chunkOfOrders.length === limit;
            iteration++;
        }

        orders.forEach(order => {
            console.log(JSON.stringify(order, null, 2));
        });
    }

    /**
     * Retrieve a chunk of orders based on query parameters
     * @param offset - The offset for pagination
     * @param limit - The number of records to retrieve
     * @returns A promise resolving to a list of orders
     */
    static async getOrderChunk(offset, limit) {
        const expansion = "item,summary,billing,shipping,shipping.tracking_number_details";
        // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
        /*
        Possible Order Expansions:
        affiliate           affiliate.ledger                    auto_order
        billing             channel_partner                     checkout
        coupon              customer_profile                    digital_order
        edi                 fraud_score                         gift
        gift_certificate    internal                            item
        linked_shipment     marketing                           payment
        payment.transaction quote                               salesforce
        shipping            shipping.tracking_number_details    summary
        taxes
        */

        const query = {};
        // Uncomment the next two lines to retrieve a single order. But there are simpler methods to do that.
        // const orderId = "DEMO-0009104390";
        // query.orderId = orderId;

        const beginDts = DateTime.now().minus({days: 2000}).toFormat("yyyy-MM-dd") + "T00:00:00+00:00"; // yes, that 2,000 days.
        const endDts = DateTime.now().toFormat("yyyy-MM-dd") + "T00:00:00+00:00";
        console.error(beginDts);
        console.error(endDts);

        query.refund_date_begin = beginDts;
        query.refund_date_end = endDts;

        const apiResponse = await new Promise((resolve, reject) => {
            orderApi.getOrdersByQuery(
                query,
                {
                    _limit: limit,
                    _offset: offset,
                    _expand: expansion
                }
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        return apiResponse.orders ?? [];
    }
}

// Example usage
// GetOrdersByQuery.execute().catch(console.error);