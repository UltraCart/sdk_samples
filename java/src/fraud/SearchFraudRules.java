package fraud;

import com.ultracart.admin.v2.FraudApi;
import com.ultracart.admin.v2.models.FraudRulePublic;
import com.ultracart.admin.v2.models.FraudRuleSearchRequest;
import com.ultracart.admin.v2.models.FraudRulesResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

/**
 * searchFraudRules returns the fraud rules that match the supplied criteria. Every field on the
 * FraudRuleSearchRequest is optional; supply only the ones you want to filter on. Pagination and
 * sort are passed as the limit, offset, and sort parameters.
 *
 * This sample searches for every rule whose action is "Decline Transaction".
 */
public class SearchFraudRules {
    public static void execute() {
        System.out.println("--- SearchFraudRules ---");
        try {
            FraudApi fraudApi = new FraudApi(Constants.API_KEY);

            FraudRuleSearchRequest searchRequest = new FraudRuleSearchRequest();
            searchRequest.setFailureAction(FraudRuleSearchRequest.FailureActionEnum.DECLINE_TRANSACTION);

            Integer limit = 200;
            Integer offset = 0;
            String sort = null;

            FraudRulesResponse apiResponse = fraudApi.searchFraudRules(searchRequest, limit, offset, sort);

            System.out.println("Found " + apiResponse.getFraudRules().size() + " rule(s) with action 'Decline Transaction'");
            for (FraudRulePublic fraudRule : apiResponse.getFraudRules()) {
                System.out.println("  oid " + fraudRule.getFraudRuleOid() + " - " + fraudRule.getRuleType() + " - " + fraudRule.getAutoNote());
            }
        } catch (ApiException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }
}
