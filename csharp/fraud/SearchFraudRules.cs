using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fraud
{
    public class SearchFraudRules
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // searchFraudRules returns the fraud rules that match the supplied criteria. Every field
                // on the FraudRuleSearchRequest is optional; supply only the ones you want to filter on.
                // Pagination and sort are passed as the limit, offset, and sort parameters.
                //
                // This sample searches for every rule whose action is "Decline Transaction".
                FraudApi fraudApi = new FraudApi(Constants.ApiKey);

                FraudRuleSearchRequest searchRequest = new FraudRuleSearchRequest();
                searchRequest.FailureAction = FraudRuleSearchRequest.FailureActionEnum.DeclineTransaction;

                FraudRulesResponse apiResponse = fraudApi.SearchFraudRules(searchRequest, 200, 0, null);

                Console.WriteLine("Found " + apiResponse.FraudRules.Count + " rule(s) with action 'Decline Transaction'");
                foreach (FraudRulePublic fraudRule in apiResponse.FraudRules)
                {
                    Console.WriteLine("  oid " + fraudRule.FraudRuleOid + " - " + fraudRule.RuleType + " - " + fraudRule.AutoNote);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }
        }
    }
}
