using System;
using System.Collections.Generic;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fraud
{
    public class InsertFraudRule
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // insertFraudRule creates a single fraud rule. Each rule has a rule_type (what it
                // inspects), a failure_action (what happens when it matches), and type-specific fields
                // such as an amount threshold, country code, ip address, or email.
                //
                // This sample has some fun and inserts several rules of different types in one run.
                // Call GetFraudLookupValues.cs to see every valid rule_type and the other lookup values.
                FraudApi fraudApi = new FraudApi(Constants.ApiKey);

                List<FraudRuleInsertRequest> rules = new List<FraudRuleInsertRequest>();

                // 1. Decline any order placed with a known-bad email address.
                FraudRuleInsertRequest emailRule = new FraudRuleInsertRequest();
                emailRule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Addressemail;
                emailRule.Email = "chargeback-charlie@example.com";
                emailRule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.DeclineTransaction;
                emailRule.AutoNote = "Known chargeback email - decline on sight";
                rules.Add(emailRule);

                // 2. Flag large single credit card transactions over $1,000 for manual review.
                FraudRuleInsertRequest largeTxnRule = new FraudRuleInsertRequest();
                largeTxnRule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Creditcardsingletransactionexceeds;
                largeTxnRule.AmountThreshold = 1000.00m;
                largeTxnRule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.FlagForReview;
                largeTxnRule.AutoNote = "Large single transaction - review before shipping";
                rules.Add(largeTxnRule);

                // 3. Decline orders that ship outside the United States.
                FraudRuleInsertRequest countryRule = new FraudRuleInsertRequest();
                countryRule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Addressnotincountry;
                countryRule.CountryCode = "US";
                countryRule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.DeclineTransaction;
                countryRule.AutoNote = "Domestic shipping only";
                rules.Add(countryRule);

                // 4. Decline transactions originating from a specific bad IP address.
                FraudRuleInsertRequest ipRule = new FraudRuleInsertRequest();
                ipRule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Ipmatches;
                ipRule.IpAddress = "203.0.113.66";
                ipRule.IpRangeType = FraudRuleInsertRequest.IpRangeTypeEnum.Address;
                ipRule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.DeclineTransaction;
                ipRule.AutoNote = "Blocked IP address";
                rules.Add(ipRule);

                // 5. Flag prepaid credit cards for review.
                FraudRuleInsertRequest prepaidRule = new FraudRuleInsertRequest();
                prepaidRule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Creditcardblockprepaid;
                prepaidRule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.FlagForReview;
                prepaidRule.AutoNote = "Prepaid card - take a closer look";
                rules.Add(prepaidRule);

                // 6. Flag a customer IP making more than 10 transactions in a single day.
                FraudRuleInsertRequest velocityRule = new FraudRuleInsertRequest();
                velocityRule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Ipdailytransactioncountexceeds;
                velocityRule.CountThreshold = 10;
                velocityRule.IpRangeType = FraudRuleInsertRequest.IpRangeTypeEnum.Address;
                velocityRule.UserAction = FraudRuleInsertRequest.UserActionEnum.Attempted;
                velocityRule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.FlagForReview;
                velocityRule.AutoNote = "IP velocity - more than 10 orders in a day";
                rules.Add(velocityRule);

                foreach (FraudRuleInsertRequest rule in rules)
                {
                    FraudRuleResponse apiResponse = fraudApi.InsertFraudRule(rule);
                    FraudRulePublic created = apiResponse.FraudRule;
                    Console.WriteLine("Inserted '" + rule.RuleType + "' rule, oid = " + created.FraudRuleOid);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }
        }
    }
}
