import { fraudApi } from "../api.js";

/**
 * establishFraudRulesFromOrder is a shortcut that derives fraud rules from an existing order.
 * Point it at an order you have identified as fraudulent and tell it which attributes of that
 * order to turn into rules: the email, the credit card, the ip address, and/or the address.
 * It creates the matching rules and returns them. This is the fast way to "block everything
 * associated with this bad order" instead of building each rule by hand.
 *
 * Not every filter produces a rule; the order must actually have that attribute. For example an
 * order with no stored card data will not produce a credit card rule.
 */
export async function establishFraudRulesFromOrder() {
  console.log(`--- ${establishFraudRulesFromOrder.name} ---`);

  const request = {
    order_id: "DEMO-0009104434",
    establish_email_filter: true,
    establish_card_filter: true,
    establish_ip_filter: true,
    establish_address_filter: true,
    failure_action: "Flag For Review",
    auto_note: "Established from fraudulent order DEMO-0009104434",
  };

  try {
    const apiResponse = await new Promise((resolve, reject) => {
      fraudApi.establishFraudRulesFromOrder(request, function (error, data, response) {
        if (error) {
          reject(error);
        } else {
          resolve(data, response);
        }
      });
    });

    const fraudRules = apiResponse.fraud_rules || [];
    console.log(`Established ${fraudRules.length} rule(s) from the order:`);
    fraudRules.forEach((fraudRule) => {
      console.log(`  oid ${fraudRule.fraud_rule_oid} - ${fraudRule.rule_type} - ${fraudRule.auto_note || ''}`);
    });
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(error instanceof Error ? error.stack : error);
  }
}

// Optional: If you want to call the function
// establishFraudRulesFromOrder().catch(console.error);
