import { fraudApi } from "../api";

/**
 * getFraudLookupValues returns the lookup values used when building fraud rules:
 * the allowed countries, affiliates, ip range types, rule groups, and rule types.
 * Call this first when constructing a rule so you supply valid values.
 */
export async function getFraudLookupValues(): Promise<void> {
  console.log(`--- ${getFraudLookupValues.name} ---`);

  try {
    const apiResponse = await fraudApi.getFraudLookupValues();
    const lookupValues = apiResponse.fraud_lookup_values || {};

    console.log("Rule types:", lookupValues.rule_types);
    console.log("Rule groups:", lookupValues.rule_groups);
    console.log("IP range types:", lookupValues.ip_range_types);
    console.log("Countries:", lookupValues.countries);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// getFraudLookupValues().catch(console.error);
