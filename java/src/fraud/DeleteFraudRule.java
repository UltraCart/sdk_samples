package fraud;

import com.ultracart.admin.v2.FraudApi;
import com.ultracart.admin.v2.models.FraudRuleInsertRequest;
import com.ultracart.admin.v2.models.FraudRuleResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;

/**
 * deleteFraudRule removes a fraud rule by its oid.
 *
 * To keep this sample self-contained it first inserts a throwaway rule, then deletes it using
 * the oid returned from the insert. In your own code you would already have the oid of the rule
 * you want to remove (for example from SearchFraudRules).
 */
public class DeleteFraudRule {
    public static void execute() {
        System.out.println("--- DeleteFraudRule ---");
        try {
            FraudApi fraudApi = new FraudApi(Constants.API_KEY);

            // Insert a rule so we have something to delete.
            FraudRuleInsertRequest rule = new FraudRuleInsertRequest();
            rule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.CREDIT_CARD_SINGLE_TRANSACTION_EXCEEDS);
            rule.setAmountThreshold(BigDecimal.valueOf(2500.00));
            rule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.FLAG_FOR_REVIEW);
            rule.setAutoNote("Temporary rule created by the DeleteFraudRule sample");

            FraudRuleResponse insertResponse = fraudApi.insertFraudRule(rule);
            Integer fraudRuleOid = insertResponse.getFraudRule().getFraudRuleOid();
            System.out.println("Inserted temporary rule, oid = " + fraudRuleOid);

            // Now delete it.
            fraudApi.deleteFraudRule(fraudRuleOid);
            System.out.println("Deleted fraud rule oid = " + fraudRuleOid);
        } catch (ApiException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }
}
