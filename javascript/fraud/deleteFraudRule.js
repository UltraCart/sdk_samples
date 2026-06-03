import { fraudApi } from "../api.js";

/**
 * deleteFraudRule removes a fraud rule by its oid.
 *
 * To keep this sample self-contained it first inserts a throwaway rule, then deletes it using
 * the oid returned from the insert. In your own code you would already have the oid of the rule
 * you want to remove (for example from searchFraudRules).
 */
export async function deleteFraudRule() {
  console.log(`--- ${deleteFraudRule.name} ---`);

  try {
    // Insert a rule so we have something to delete.
    const rule = {
      rule_type: "credit card single transaction exceeds",
      amount_threshold: 2500.0,
      failure_action: "Flag For Review",
      auto_note: "Temporary rule created by the deleteFraudRule sample",
    };

    const insertResponse = await new Promise((resolve, reject) => {
      fraudApi.insertFraudRule(rule, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    const fraudRuleOid = insertResponse.fraud_rule.fraud_rule_oid;
    console.log(`Inserted temporary rule, oid = ${fraudRuleOid}`);

    // Now delete it.
    await new Promise((resolve, reject) => {
      fraudApi.deleteFraudRule(fraudRuleOid, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    console.log(`Deleted fraud rule oid = ${fraudRuleOid}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// deleteFraudRule().catch(console.error);
