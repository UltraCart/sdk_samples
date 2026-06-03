import { fraudApi } from "../api";
import { FraudRuleInsertRequest } from 'ultracart_rest_api_v2_typescript';

/**
 * deleteFraudRule removes a fraud rule by its oid.
 *
 * To keep this sample self-contained it first inserts a throwaway rule, then deletes it using
 * the oid returned from the insert. In your own code you would already have the oid of the rule
 * you want to remove (for example from searchFraudRules).
 */
export async function deleteFraudRule(): Promise<void> {
  console.log(`--- ${deleteFraudRule.name} ---`);

  try {
    // Insert a rule so we have something to delete.
    const rule: FraudRuleInsertRequest = {
      rule_type: "credit card single transaction exceeds",
      amount_threshold: 2500.0,
      failure_action: "Flag For Review",
      auto_note: "Temporary rule created by the DeleteFraudRule sample",
    };

    const insertResponse = await fraudApi.insertFraudRule({ fraudRuleInsertRequest: rule });
    const fraudRuleOid = insertResponse.fraud_rule?.fraud_rule_oid;
    console.log(`Inserted temporary rule, oid = ${fraudRuleOid}`);

    if (fraudRuleOid !== undefined) {
      // Now delete it.
      await fraudApi.deleteFraudRule({ fraudRuleOid });
      console.log(`Deleted fraud rule oid = ${fraudRuleOid}`);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// deleteFraudRule().catch(console.error);
