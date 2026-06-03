using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fraud
{
    public class GetFraudLookupValues
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // getFraudLookupValues returns the lookup values used when building fraud rules:
                // the allowed countries, affiliates, ip range types, rule groups, and rule types.
                // Call this first when constructing a rule so you supply valid values.
                FraudApi fraudApi = new FraudApi(Constants.ApiKey);

                FraudLookupValuesResponse apiResponse = fraudApi.GetFraudLookupValues();
                FraudLookupValues lookupValues = apiResponse.FraudLookupValues;

                Console.WriteLine("Rule types: " + lookupValues.RuleTypes);
                Console.WriteLine("Rule groups: " + lookupValues.RuleGroups);
                Console.WriteLine("IP range types: " + lookupValues.IpRangeTypes);
                Console.WriteLine("Countries: " + lookupValues.Countries);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }
        }
    }
}
