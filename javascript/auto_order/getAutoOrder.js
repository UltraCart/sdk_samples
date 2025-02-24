import { autoOrderApi } from "../api.js";

/**
 * Retrieves an auto_order given the auto_order_oid.
 */
export async function getAutoOrder() {
  console.log(`--- ${getAutoOrder.name} ---`);

  try {
    // Expand parameter to include additional details
    const expand = 'items,items.future_schedules,original_order,rebill_orders';
    // See https://www.ultracart.com/api/#resource_auto_order.html for list

    // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
    const autoOrderOid = 123456789;

    const apiResponse = await new Promise((resolve, reject) => {
      autoOrderApi.getAutoOrder(autoOrderOid, {_expand: expand}, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });
    const autoOrder = apiResponse.auto_order;

    console.log(autoOrder);
  } catch (error) {
    // Error handling
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// getAutoOrder().catch(console.error);