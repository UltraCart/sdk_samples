import {autoOrderApi} from "../api.js";

/**
 * Consolidate Auto Orders
 *
 * An auto order with no items, the original_order is used for shipping, billing, and payment information.
 * Once you have your empty auto order, add items to it and call updateAutoOrder.
 */
export async function consolidateAutoOrders() {
    console.log(`--- ${consolidateAutoOrders.name} ---`);

    try {

        // Expand parameter to include additional details
        const expand = 'items,items.future_schedules,original_order,rebill_orders';
        // See https://www.ultracart.com/api/#resource_auto_order.html for full list of expand options

        // Target auto order OID (replace with actual value)
        const targetAutoOrderOid = 123456789;

        // Consolidate request object
        const consolidateRequest = {
            source_auto_order_oids: [23456789, 3456789] // Auto order OIDs to consolidate into the target
        };

        // Perform the consolidation
        const apiResponse = await new Promise((resolve, reject) => {
            autoOrderApi.consolidateAutoOrders(targetAutoOrderOid, consolidateRequest, {_expand: expand}, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        // Extracted consolidated auto order
        const consolidatedAutoOrder = apiResponse.auto_order;

        // TODO: Verify the consolidated order has all items and history from source orders
        console.log(consolidatedAutoOrder);
    } catch (error) {
        // Error handling
        console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(error instanceof Error ? error.stack : error);
    }
}

// Optional: If you want to call the function
// consolidateAutoOrders().catch(console.error);