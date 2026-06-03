package fraud;

import com.ultracart.admin.v2.FraudApi;
import com.ultracart.admin.v2.models.FraudRuleInsertRequest;
import com.ultracart.admin.v2.models.FraudRulePublic;
import com.ultracart.admin.v2.models.FraudRuleResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * insertFraudRule creates a single fraud rule. Each rule has a rule_type (what it inspects),
 * a failure_action (what happens when it matches), and type-specific fields such as an amount
 * threshold, country code, ip address, or email.
 *
 * This sample has some fun and inserts several rules of different types in one run. Call
 * GetFraudLookupValues.java to see every valid rule_type and the other lookup values.
 */
public class InsertFraudRule {
    public static void execute() {
        System.out.println("--- InsertFraudRule ---");
        try {
            FraudApi fraudApi = new FraudApi(Constants.API_KEY);

            List<FraudRuleInsertRequest> rules = new ArrayList<>();

            // 1. Decline any order placed with a known-bad email address.
            FraudRuleInsertRequest emailRule = new FraudRuleInsertRequest();
            emailRule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.ADDRESS_EMAIL);
            emailRule.setEmail("chargeback-charlie@example.com");
            emailRule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.DECLINE_TRANSACTION);
            emailRule.setAutoNote("Known chargeback email - decline on sight");
            rules.add(emailRule);

            // 2. Flag large single credit card transactions over $1,000 for manual review.
            FraudRuleInsertRequest largeTxnRule = new FraudRuleInsertRequest();
            largeTxnRule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.CREDIT_CARD_SINGLE_TRANSACTION_EXCEEDS);
            largeTxnRule.setAmountThreshold(BigDecimal.valueOf(1000.00));
            largeTxnRule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.FLAG_FOR_REVIEW);
            largeTxnRule.setAutoNote("Large single transaction - review before shipping");
            rules.add(largeTxnRule);

            // 3. Decline orders that ship outside the United States.
            FraudRuleInsertRequest countryRule = new FraudRuleInsertRequest();
            countryRule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.ADDRESS_NOT_IN_COUNTRY);
            countryRule.setCountryCode("US");
            countryRule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.DECLINE_TRANSACTION);
            countryRule.setAutoNote("Domestic shipping only");
            rules.add(countryRule);

            // 4. Decline transactions originating from a specific bad IP address.
            FraudRuleInsertRequest ipRule = new FraudRuleInsertRequest();
            ipRule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.IP_MATCHES);
            ipRule.setIpAddress("203.0.113.66");
            ipRule.setIpRangeType(FraudRuleInsertRequest.IpRangeTypeEnum.ADDRESS);
            ipRule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.DECLINE_TRANSACTION);
            ipRule.setAutoNote("Blocked IP address");
            rules.add(ipRule);

            // 5. Flag prepaid credit cards for review.
            FraudRuleInsertRequest prepaidRule = new FraudRuleInsertRequest();
            prepaidRule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.CREDIT_CARD_BLOCK_PREPAID);
            prepaidRule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.FLAG_FOR_REVIEW);
            prepaidRule.setAutoNote("Prepaid card - take a closer look");
            rules.add(prepaidRule);

            // 6. Flag a customer IP making more than 10 transactions in a single day.
            FraudRuleInsertRequest velocityRule = new FraudRuleInsertRequest();
            velocityRule.setRuleType(FraudRuleInsertRequest.RuleTypeEnum.IP_DAILY_TRANSACTION_COUNT_EXCEEDS);
            velocityRule.setCountThreshold(10);
            velocityRule.setIpRangeType(FraudRuleInsertRequest.IpRangeTypeEnum.ADDRESS);
            velocityRule.setUserAction(FraudRuleInsertRequest.UserActionEnum.ATTEMPTED);
            velocityRule.setFailureAction(FraudRuleInsertRequest.FailureActionEnum.FLAG_FOR_REVIEW);
            velocityRule.setAutoNote("IP velocity - more than 10 orders in a day");
            rules.add(velocityRule);

            for (FraudRuleInsertRequest rule : rules) {
                FraudRuleResponse apiResponse = fraudApi.insertFraudRule(rule);
                FraudRulePublic created = apiResponse.getFraudRule();
                System.out.println("Inserted '" + rule.getRuleType() + "' rule, oid = " + created.getFraudRuleOid());
            }
        } catch (ApiException e) {
            System.out.println("Exception: " + e.getMessage());
        }
    }
}
