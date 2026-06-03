import { fraudApi } from "../api.js";

/**
 * declineEmail is a shortcut for telling UltraCart to decline orders from a specific email
 * address. It is the quick alternative to building a full "address email" fraud rule by hand.
 */
export async function declineEmail() {
  console.log(`--- ${declineEmail.name} ---`);

  const declineRequest = {
    email: "chargeback-charlie@example.com",
  };

  try {
    await new Promise((resolve, reject) => {
      fraudApi.declineEmail(declineRequest, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    console.log(`Declined email: ${declineRequest.email}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// declineEmail().catch(console.error);
