import {autoOrderApi} from "../api.js";

/**
 * getAutoOrders provides a query service on AutoOrders (aka subscriptions or recurring orders) within the UltraCart
 * system. It was the first query provided and the most cumbersome to use.  Please use getAutoOrdersByQuery for an
 * easier query method.  If you have multiple auto_order_oids and need the corresponding objects, consider
 * getAutoOrdersBatch() to reduce call count.
 */
export class GetAutoOrders {
    /**
     * Executes the auto orders retrieval process
     */
    static async execute() {
        console.log(`--- ${this.name} ---`);

        try {
            const autoOrders = [];

            let iteration = 1;
            let offset = 0;
            const limit = 200;
            let moreRecordsToFetch = true;

            while (moreRecordsToFetch) {
                console.log(`executing iteration ${iteration}`);
                const chunkOfAutoOrders = await this.getAutoOrderChunk(offset, limit);
                autoOrders.push(...chunkOfAutoOrders);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfAutoOrders.length === limit;
                iteration++;
            }

            // Display the auto orders
            for (const autoOrder of autoOrders) {
                console.log(autoOrder);
            }

            console.log(`Total auto orders retrieved: ${autoOrders.length}`);
        } catch (ex) {
            console.error(`Error: ${ex instanceof Error ? ex.message : String(ex)}`);
            console.error(ex instanceof Error ? ex.stack : 'No stack trace available');
        }
    }

    /**
     * Returns a chunk of auto orders based on query parameters
     * @param offset Pagination offset
     * @param limit Maximum number of records to return
     * @returns List of matching auto orders
     */
    static async getAutoOrderChunk(offset, limit) {
        const expand = "items,original_order,rebill_orders";
        /*
        Possible Order Expansions:

        add_ons                             items.sample_schedule	        original_order.buysafe	        original_order.payment.transaction
        items	                            original_order	                original_order.channel_partner	original_order.quote
        items.future_schedules	            original_order.affiliate	    original_order.checkout	        original_order.salesforce
        original_order.affiliate.ledger	    original_order.coupon	        original_order.shipping
        original_order.auto_order	        original_order.customer_profile	original_order.summary
        original_order.billing	            original_order.digital_order	original_order.taxes
        rebill_orders	                    original_order.edi	            rebill_orders.affiliate
        rebill_orders.affiliate.ledger	    original_order.fraud_score	    rebill_orders.auto_order
        rebill_orders.billing	            original_order.gift	            rebill_orders.buysafe
        rebill_orders.channel_partner	    original_order.gift_certificate	rebill_orders.checkout
        rebill_orders.coupon	            original_order.internal	        rebill_orders.customer_profile
        rebill_orders.digital_order	        original_order.item	            rebill_orders.edi
        rebill_orders.fraud_score	        original_order.linked_shipment	rebill_orders.gift
        rebill_orders.gift_certificate      original_order.marketing	    rebill_orders.internal
        rebill_orders.item	                original_order.payment	        rebill_orders.linked_shipment
        rebill_orders.marketing	            rebill_orders.payment	        rebill_orders.quote
        rebill_orders.payment.transaction	rebill_orders.salesforce	    rebill_orders.shipping
        rebill_orders.summary	            rebill_orders.taxes
        */

        const queryParams = {
            autoOrderCode: undefined,
            originalOrderId: undefined,
            firstName: undefined,
            lastName: undefined,
            company: undefined,
            city: undefined,
            state: undefined,
            postalCode: undefined,
            countryCode: undefined,
            phone: undefined,
            email: "test@ultracart.com", // for this example, we are only filtering on email address
            originalOrderDateBegin: undefined,
            originalOrderDateEnd: undefined,
            nextShipmentDateBegin: undefined,
            nextShipmentDateEnd: undefined,
            cardType: undefined,
            itemId: undefined,
            status: undefined,
            _limit: limit,
            _offset: offset,
            _since: undefined,
            _sort: undefined,
            _expand: expand
        };

        const apiResponse = await new Promise((resolve, reject) => {
            autoOrderApi.getAutoOrders(queryParams, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        return apiResponse.auto_orders ?? [];
    }
}

// Define an object for the query parameters to make the code more structured
// Note: In JavaScript, we don't need a separate interface definition