import { autoOrderApi } from "../api";
import { AutoOrder } from 'ultracart_rest_api_v2_typescript';

/**
 * Retrieves an auto_order given the auto_order_oid.
 */
export async function getAutoOrder(): Promise<void> {
  console.log(`--- ${getAutoOrder.name} ---`);

  try {
    // Expand parameter to include additional details
    const expand = 'items,items.future_schedules,original_order,rebill_orders';
    // See https://www.ultracart.com/api/#resource_auto_order.html for list

    // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
    const autoOrderOid: number = 123456789;

    const apiResponse = await autoOrderApi.getAutoOrder({autoOrderOid, expand});
    const autoOrder: AutoOrder|undefined = apiResponse.auto_order;

    console.log(autoOrder);
  } catch (error) {
    // Error handling
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// getAutoOrder().catch(console.error);