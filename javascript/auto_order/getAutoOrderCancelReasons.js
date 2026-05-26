import { autoOrderApi } from "../api.js";

/**
 * Retrieves the list of cancel reasons that can be presented to customers when
 * cancelling an auto order (e.g., in MyAccount). Each reason includes the reason
 * text, an optional MyAccount alternate description, and whether the reason is
 * visible in MyAccount.
 */
export async function getAutoOrderCancelReasons() {
  console.log(`--- ${getAutoOrderCancelReasons.name} ---`);

  try {
    const apiResponse = await new Promise((resolve, reject) => {
      autoOrderApi.getAutoOrderCancelReasons(function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    const cancelReasons = apiResponse.cancel_reasons || [];
    cancelReasons.forEach((cancelReason) => {
      console.log(cancelReason);
    });
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// getAutoOrderCancelReasons().catch(console.error);
