using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fraud
{
    public class DeleteFraudRule
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // deleteFraudRule removes a fraud rule by its oid.
                //
                // To keep this sample self-contained it first inserts a throwaway rule, then deletes it
                // using the oid returned from the insert. In your own code you would already have the oid
                // of the rule you want to remove (for example from SearchFraudRules).
                FraudApi fraudApi = new FraudApi(Constants.ApiKey);

                // Insert a rule so we have something to delete.
                FraudRuleInsertRequest rule = new FraudRuleInsertRequest();
                rule.RuleType = FraudRuleInsertRequest.RuleTypeEnum.Creditcardsingletransactionexceeds;
                rule.AmountThreshold = 2500.00m;
                rule.FailureAction = FraudRuleInsertRequest.FailureActionEnum.FlagForReview;
                rule.AutoNote = "Temporary rule created by the DeleteFraudRule sample";

                FraudRuleResponse insertResponse = fraudApi.InsertFraudRule(rule);
                int fraudRuleOid = insertResponse.FraudRule.FraudRuleOid;
                Console.WriteLine("Inserted temporary rule, oid = " + fraudRuleOid);

                // Now delete it.
                fraudApi.DeleteFraudRule(fraudRuleOid);
                Console.WriteLine("Deleted fraud rule oid = " + fraudRuleOid);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }
        }
    }
}
