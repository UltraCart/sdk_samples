import { autoOrderApi } from '../api.js';

/**
 * Cancel a single item on an auto order, identified by the reference (original) order id
 * that placed the auto order and the original item id on that order. This is useful when
 * you know the original UltraCart order id rather than the auto_order_oid.
 */
export async function execute() {
  const referenceOrderId = "DEMO-12345678"; // the UltraCart order id that placed the auto order
  const originalItemId   = "ITEM001";       // the merchant item id on that original order
  const opts = {
    '_expand': 'items' // see https://www.ultracart.com/api/#resource_auto_order.html for list
  };

  const response = await new Promise((resolve, reject) => {
    autoOrderApi.cancelAutoOrderItemByReferenceOrderId(referenceOrderId, originalItemId, opts, function (error, data, response) {
      if (error) {
        reject(error);
      } else {
        resolve(data, response);
      }
    });
  });

  const autoOrder = response.auto_order;
  console.log(autoOrder);
}
