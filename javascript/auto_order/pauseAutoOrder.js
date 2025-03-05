import { autoOrderApi } from '../api.js';

/**
 * This is a convenience method created for an UltraCart merchant to pause a large number of auto orders
 * due to an inventory shortage. This is not new functionality and can be accomplished with the normal updateAutoOrder
 * call. It does the following logic to an auto order:
 * for each item in the auto order:
 *    if the item is not paused, pause it, setPause(true)
 * save the changes by calling updateAutoOrder()
 *
 * Some warnings if you choose to use this method.
 * There are no convenience methods to unpause auto orders.
 * There are no convenience methods to query which auto orders are paused.
 * We do not recommend pausing auto orders and the merchant is on their own to manage auto order state if they
 * choose to begin pausing orders. Keep good track of what you're doing.
 */
export async function execute() {
  // see https://www.ultracart.com/api/#resource_auto_order.html for list
  const expand = "items";

  // get an auto order and update it. There are many ways to retrieve an auto order.
  const autoOrderOid = 123456789;

  const getResponse = await new Promise((resolve, reject) => {
    autoOrderApi.getAutoOrder(autoOrderOid, function (error, data, response) {
      if (error) {
        reject(error);
      } else {
        resolve(data, response);
      }
    });
  });

  const autoOrder = getResponse.auto_order;

  const pauseResponse = await new Promise((resolve, reject) => {
    autoOrderApi.pauseAutoOrder(autoOrderOid, autoOrder, function (error, data, response) {
      if (error) {
        reject(error);
      } else {
        resolve(data, response);
      }
    });
  });

  const pausedAutoOrder = pauseResponse.auto_order;
  console.log(pausedAutoOrder);
}