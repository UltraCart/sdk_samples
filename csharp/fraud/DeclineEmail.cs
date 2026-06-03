using System;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.fraud
{
    public class DeclineEmail
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            try
            {
                // declineEmail is a shortcut for telling UltraCart to decline orders from a specific
                // email address. It is the quick alternative to building a full "address email" fraud
                // rule by hand.
                FraudApi fraudApi = new FraudApi(Constants.ApiKey);

                FraudDeclineEmailRequest declineRequest = new FraudDeclineEmailRequest();
                declineRequest.Email = "chargeback-charlie@example.com";

                fraudApi.DeclineEmail(declineRequest);

                Console.WriteLine("Declined email: " + declineRequest.Email);
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception: " + e.Message);
            }
        }
    }
}
