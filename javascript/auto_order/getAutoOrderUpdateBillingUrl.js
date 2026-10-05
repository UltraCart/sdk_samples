import { autoOrderApi } from "../api.js";

/**
 * Generates the url a customer can use to update the billing information on an auto order.
 * This is the same url sent in the auto order update billing email.
 *
 * Requires the auto_order_write scope because the url carries a customer access token.
 *
 * If you have an order id (original or rebill) instead of the auto_order_oid, see OrderApi.getUpdateBillingUrl()
 */
export async function getAutoOrderUpdateBillingUrl() {
  console.log(`--- ${getAutoOrderUpdateBillingUrl.name} ---`);

  try {
    // If you don't know the oid, use getAutoOrdersByQuery for retrieving auto orders
    const autoOrderOid = 123456789;

    const apiResponse = await new Promise((resolve, reject) => {
      autoOrderApi.getAutoOrderUpdateBillingUrl(autoOrderOid, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    // WARNING: The update billing url grants access to the customer's billing information.
    // Do not log it or expose it publicly in production.  It is printed here for demonstration only.
    console.log(`Update Billing Url: ${apiResponse.update_billing_url}`);
  } catch (error) {
    // Error handling
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// getAutoOrderUpdateBillingUrl().catch(console.error);
