import { fraudApi } from "../api";

/**
 * declineEmail is a shortcut for telling UltraCart to decline orders from a specific email
 * address. It is the quick alternative to building a full "address email" fraud rule by hand.
 */
export async function declineEmail(): Promise<void> {
  console.log(`--- ${declineEmail.name} ---`);

  const email = "chargeback-charlie@example.com";

  try {
    await fraudApi.declineEmail({ fraudDeclineEmailsRequest: { email } });
    console.log(`Declined email: ${email}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// declineEmail().catch(console.error);
