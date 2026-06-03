package fraud;

import com.ultracart.admin.v2.FraudApi;
import com.ultracart.admin.v2.models.FraudRuleFromOrderRequest;
import com.ultracart.admin.v2.models.FraudRulePublic;
import com.ultracart.admin.v2.models.FraudRulesResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

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
public class EstablishFraudRulesFromOrder {
    public static void execute() {
        System.out.println("--- EstablishFraudRulesFromOrder ---");
        try {
            FraudApi fraudApi = new FraudApi(Constants.API_KEY);

            FraudRuleFromOrderRequest request = new FraudRuleFromOrderRequest();
            request.setOrderId("DEMO-0009104434");
            request.setEstablishEmailFilter(true);
            request.setEstablishCardFilter(true);
            request.setEstablishIpFilter(true);
            request.setEstablishAddressFilter(true);
            request.setFailureAction(FraudRuleFromOrderRequest.FailureActionEnum.FLAG_FOR_REVIEW);
            request.setAutoNote("Established from fraudulent order DEMO-0009104434");

            FraudRulesResponse apiResponse = fraudApi.establishFraudRulesFromOrder(request);

            System.out.println("Established " + apiResponse.getFraudRules().size() + " rule(s) from the order:");
            for (FraudRulePublic fraudRule : apiResponse.getFraudRules()) {
                System.out.println("  oid " + fraudRule.getFraudRuleOid() + " - " + fraudRule.getRuleType() + " - " + fraudRule.getAutoNote());
            }
        } catch (ApiException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }
}
