import { fraudApi } from "../api";

/**
 * searchFraudRules returns the fraud rules that match the supplied criteria. Every field on the
 * search request is optional; supply only the ones you want to filter on. Pagination and sort
 * are passed as the limit, offset, and sort parameters.
 *
 * This sample searches for every rule whose action is "Decline Transaction".
 */
export async function searchFraudRules(): Promise<void> {
  console.log(`--- ${searchFraudRules.name} ---`);

  try {
    const apiResponse = await fraudApi.searchFraudRules({
      fraudRuleSearchRequest: { failure_action: "Decline Transaction" },
      limit: 200,
      offset: 0,
    });

    const fraudRules = apiResponse.fraud_rules || [];
    console.log(`Found ${fraudRules.length} rule(s) with action 'Decline Transaction'`);
    fraudRules.forEach((fraudRule) => {
      console.log(`  oid ${fraudRule.fraud_rule_oid} - ${fraudRule.rule_type} - ${fraudRule.auto_note || ''}`);
    });
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// searchFraudRules().catch(console.error);
