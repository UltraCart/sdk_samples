import {autoOrderApi} from "../api.js";

/**
 * This example illustrates how to retrieve auto orders when you have a list of auto_order_oid.
 * These are the possible expansion values for auto orders.  This list is taken from www.ultracart.com/api/
 * and may become stale. Please review the master website when in doubt.
 *
 * Possible expansion values include:
 * - items
 * - items.future_schedules
 * - items.sample_schedule
 * - original_order
 * - original_order.affiliate
 * ... (full list of expansions from original comment)
 */
export class GetAutoOrdersBatch {
    /**
     * Executes batch retrieval of auto orders
     */
    static async execute() {
        console.log(`--- ${this.name} ---`);

        try {
            // Define expansion fields
            const expand =
                "items,items.future_schedules,original_order,rebill_orders"; // contact us if you're unsure what you need

            // Define auto order OIDs (numbers)
            const autoOrderOids = [123456, 234567, 345678, 456789];

            // Create batch request
            const batchRequest = {
                auto_order_oids: autoOrderOids
            };

            // Retrieve auto orders
            const apiResponse = await new Promise((resolve, reject) => {
                autoOrderApi.getAutoOrdersBatch(batchRequest, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const autoOrders = apiResponse.auto_orders ?? [];

            // Display auto orders
            for (const autoOrder of autoOrders) {
                console.log(autoOrder);
            }

            console.log(`Retrieved ${autoOrders.length} auto orders`);
        } catch (ex) {
            console.error(`Error: ${ex instanceof Error ? ex.message : String(ex)}`);
            console.error(ex instanceof Error ? ex.stack : 'No stack trace available');
        }
    }
}

// Optionally, if you need to call this
// GetAutoOrdersBatch.execute().catch(console.error);