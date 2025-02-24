import {DateTime} from 'luxon';
import {autoOrderApi} from '../api';
import {
    AutoOrderApi,
    AutoOrder,
    AutoOrderQuery
} from 'ultracart_rest_api_v2_typescript';

/**
 * This example illustrates how to retrieve auto orders and handle pagination.
 *
 * These are the possible expansion values for auto orders. This list is taken from www.ultracart.com/api/
 * and may become stale. Please review the master website when in doubt.
 * Expansion options include:
 *            items
 *             items.future_schedules
 *             items.sample_schedule
 *             original_order
 *             original_order.affiliate
 *             original_order.affiliate.ledger
 *             original_order.auto_order
 *             original_order.billing
 *             original_order.buysafe
 *             original_order.channel_partner
 *             original_order.checkout
 *             original_order.coupon
 *             original_order.customer_profile
 *             original_order.digital_order
 *             original_order.edi
 *             original_order.fraud_score
 *             original_order.gift
 *             original_order.gift_certificate
 *             original_order.internal
 *             original_order.item
 *             original_order.linked_shipment
 *             original_order.marketing
 *             original_order.payment
 *             original_order.payment.transaction
 *             original_order.quote
 *             original_order.salesforce
 *             original_order.shipping
 *             original_order.summary
 *             original_order.taxes
 *             rebill_orders
 *             rebill_orders.affiliate
 *             rebill_orders.affiliate.ledger
 *             rebill_orders.auto_order
 *             rebill_orders.billing
 *             rebill_orders.buysafe
 *             rebill_orders.channel_partner
 *             rebill_orders.checkout
 *             rebill_orders.coupon
 *             rebill_orders.customer_profile
 *             rebill_orders.digital_order
 *             rebill_orders.edi
 *             rebill_orders.fraud_score
 *             rebill_orders.gift
 *             rebill_orders.gift_certificate
 *             rebill_orders.internal
 *             rebill_orders.item
 *             rebill_orders.linked_shipment
 *             rebill_orders.marketing
 *             rebill_orders.payment
 *             rebill_orders.payment.transaction
 *             rebill_orders.quote
 *             rebill_orders.salesforce
 *             rebill_orders.shipping
 *             rebill_orders.summary
 *             rebill_orders.taxes
 */
export class GetAutoOrdersByQuery {
    /**
     * Executes the auto order retrieval process
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            const autoOrders: AutoOrder[] = [];

            let iteration = 1;
            let offset = 0;
            const limit = 200;
            let moreRecordsToFetch = true;

            while (moreRecordsToFetch) {
                console.log(`executing iteration ${iteration}`);

                const chunkOfOrders = await this.getAutoOrderChunk(offset, limit);
                autoOrders.push(...chunkOfOrders);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfOrders.length === limit;
                iteration++;
            }

            // Display auto orders
            for (const autoOrder of autoOrders) {
                console.log(autoOrder);
            }

            console.log(`Retrieved ${autoOrders.length} auto orders`);
        } catch (ex) {
            console.error('ApiException occurred on iteration');
            console.error(ex);
            process.exit(1);
        }
    }

    /**
     * Returns a chunk of auto orders based on query parameters
     * @param offset Pagination offset
     * @param limit Maximum number of records to return
     * @returns List of matching auto orders
     */
    private static async getAutoOrderChunk(offset: number, limit: number): Promise<AutoOrder[]> {
        // Expansions for retrieving additional data
        const expand =
            "items,items.future_schedules,original_order,rebill_orders"; // contact us if you're unsure what you need

        /*
         * Supported sorting fields:
         * auto_order_code
         * order_id
         * shipping.company
         * shipping.first_name
         * shipping.last_name
         * shipping.city
         * shipping.state_region
         * shipping.postal_code
         * shipping.country_code
         * billing.phone
         * billing.email
         * billing.cc_email
         * billing.company
         * billing.first_name
         * billing.last_name
         * billing.city
         * billing.state
         * billing.postal_code
         * billing.country_code
         * creation_dts
         * payment.payment_dts
         * checkout.screen_branding_theme_code
         * next_shipment_dts
         */
        const sort = "next_shipment_dts";

        const query: AutoOrderQuery = {
            email: "support@ultracart.com"
        };

        const apiResponse = await autoOrderApi.getAutoOrdersByQuery({
            autoOrderQuery: query,
            limit,
            offset,
            sort,
            expand
        });

        return apiResponse.auto_orders ?? [];
    }
}

// Example of how to call the method
// GetAutoOrdersByQuery.execute().catch(console.error);