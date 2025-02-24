import { autoOrderApi } from "../api";
import { AutoOrder } from 'ultracart_rest_api_v2_typescript';

/**
 * This example illustrates how to query an auto order when you know the original order id.
 * These are the possible expansion values for auto orders. This list is taken from www.ultracart.com/api/
 * and may become stale. Please review the master website when in doubt.
 *
 * Expansion values include (but are not limited to):
 * - items
 * - items.future_schedules
 * - items.sample_schedule
 * - original_order
 * - original_order.affiliate
 * - original_order.affiliate.ledger
 * ... (full list of expansions)
 * - rebill_orders.taxes
 */
export async function getAutoOrderByReferenceOrderId(): Promise<void> {
  console.log(`--- ${getAutoOrderByReferenceOrderId.name} ---`);

  try {
    // Contact UltraCart if you're unsure what expansions you need
    const expand = 'items,items.future_schedules,original_order,rebill_orders';

    const originalOrderId = 'DEMO-12345678';
    const apiResponse = await autoOrderApi.getAutoOrderByReferenceOrderId({referenceOrderId: originalOrderId, expand});
    const autoOrder: AutoOrder|undefined = apiResponse.auto_order;

    // This will be verbose...
    console.log(autoOrder);
  } catch (error) {
    // Error handling
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// getAutoOrderByReferenceOrderId().catch(console.error);