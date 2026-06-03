using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fraud
{
    public class EstablishFraudRulesFromOrder
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // establishFraudRulesFromOrder is a shortcut that derives fraud rules from an existing
                // order. Point it at an order you have identified as fraudulent and tell it which
                // attributes of that order to turn into rules: the email, the credit card, the ip
                // address, and/or the address. It creates the matching rules and returns them. This is
                // the fast way to "block everything associated with this bad order" instead of building
                // each rule by hand.
                //
                // Not every filter produces a rule; the order must actually have that attribute. For
                // example an order with no stored card data will not produce a credit card rule.
                FraudApi fraudApi = new FraudApi(Constants.ApiKey);

                FraudRuleFromOrderRequest request = new FraudRuleFromOrderRequest();
                request.OrderId = "DEMO-0009104434";
                request.EstablishEmailFilter = true;
                request.EstablishCardFilter = true;
                request.EstablishIpFilter = true;
                request.EstablishAddressFilter = true;
                request.FailureAction = FraudRuleFromOrderRequest.FailureActionEnum.FlagForReview;
                request.AutoNote = "Established from fraudulent order DEMO-0009104434";

                FraudRulesResponse apiResponse = fraudApi.EstablishFraudRulesFromOrder(request);

                Console.WriteLine("Established " + apiResponse.FraudRules.Count + " rule(s) from the order:");
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
