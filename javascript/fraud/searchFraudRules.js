import { fraudApi } from "../api.js";

/**
 * searchFraudRules returns the fraud rules that match the supplied criteria. Every field on the
 * search request is optional; supply only the ones you want to filter on. Pagination and sort
 * are passed as options (_limit, _offset, _sort).
 *
 * This sample searches for every rule whose action is "Decline Transaction".
 */
export async function searchFraudRules() {
  console.log(`--- ${searchFraudRules.name} ---`);

  const searchRequest = {
    failure_action: "Decline Transaction",
  };

  const opts = {
    _limit: 200,
    _offset: 0,
  };

  try {
    const apiResponse = await new Promise((resolve, reject) => {
      fraudApi.searchFraudRules(searchRequest, opts, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
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
