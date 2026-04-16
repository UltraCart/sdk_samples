import { autoOrderApi } from '../api';

/**
 * Cancel a single item on an auto order, identified by the reference (original) order id
 * that placed the auto order and the original item id on that order. This is useful when
 * you know the original UltraCart order id rather than the auto_order_oid.
 */
export async function execute(): Promise<void> {
  const referenceOrderId: string = "DEMO-12345678"; // the UltraCart order id that placed the auto order
  const originalItemId: string   = "ITEM001";       // the merchant item id on that original order
  const expand: string           = "items";         // see https://www.ultracart.com/api/#resource_auto_order.html for list

  const response = await autoOrderApi.cancelAutoOrderItemByReferenceOrderId({
    referenceOrderId: referenceOrderId,
    originalItemId: originalItemId,
    expand: expand
  });

  const autoOrder = response.auto_order;
  console.log(autoOrder);
}
