import {autoOrderApi} from "../api";
import {
    AutoOrder,
    AutoOrderItem
} from 'ultracart_rest_api_v2_typescript';

/**
 * This method takes a normal order id and creates an empty auto order from it.  While this might seem useless having
 * an auto order with no items, the original_order is used for shipping, billing, and payment information.
 * Once you have your empty auto order, add items to it and call updateAutoOrder.
 */
export async function establishAutoOrderByReferenceOrderId(): Promise<void> {
    console.log(`--- ${establishAutoOrderByReferenceOrderId.name} ---`);

    try {
        // Expand parameter to include additional details
        const expand = 'items,items.future_schedules,original_order,rebill_orders';
        // see https://www.ultracart.com/api/#resource_auto_order.html for list

        const originalOrderId = 'DEMO-123457';
        const apiResponse = await autoOrderApi.establishAutoOrderByReferenceOrderId({referenceOrderId: originalOrderId, expand});

        const emptyAutoOrderOrUndefined: AutoOrder | undefined = apiResponse.auto_order;
        if (emptyAutoOrderOrUndefined !== undefined) {
            let emptyAutoOrder = emptyAutoOrderOrUndefined;
            const autoOrderOid: number = emptyAutoOrder.auto_order_oid || 0;

            // Create items for the auto order
            const items: AutoOrderItem[] = [];
            const item: AutoOrderItem = {
                original_item_id: 'ITEM_ABC', // This item should be configured with auto order features
                original_quantity: 1,
                arbitrary_unit_cost: 59.99,
                // Valid Frequencies:
                // "Weekly", "Biweekly", "Every...", "Every 10 Days", "Every 4 Weeks", "Every 6 Weeks", "Every 8 Weeks",
                // "Every 24 Days", "Every 28 Days", "Monthly", "Every 45 Days", "Every 2 Months", "Every 3 Months",
                // "Every 4 Months", "Every 5 Months", "Every 6 Months", "Yearly"
                frequency: 'Monthly'
            };
            items.push(item);
            emptyAutoOrder.items = items;

            const validateOriginalOrder = 'No';
            const updateResponse = await autoOrderApi.updateAutoOrder({
                autoOrderOid,
                autoOrder: emptyAutoOrder,
                validateOriginalOrder,
                expand
            });
            //     autoOrderOid: number;
            // autoOrder: AutoOrder;
            // validateOriginalOrder?: string;
            // expand?: string;

            const updatedAutoOrder: AutoOrder | undefined = updateResponse.auto_order;
            console.log(updatedAutoOrder);

        }
    } catch (error) {
        // Error handling
        console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(error instanceof Error ? error.stack : error);
    }
}

// Optional: If you want to call the function
// establishAutoOrderByReferenceOrderId().catch(console.error);