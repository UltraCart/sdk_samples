using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.item
{
    public class GetPricingTiers
    {
        /// <summary>
        /// Execute method containing all business logic
        /// </summary>
        public static void Execute()
        {
            ItemApi itemApi = new ItemApi(Constants.ApiKey);

            try
            {
                /*
                 * Possible expansion values for PricingTier object:
                 * approval_notification
                 * signup_notification
                 */

                string expand = "approval_notification,signup_notification";
                PricingTiersResponse apiResponse = itemApi.GetPricingTiers(expand);

                // Display pricing tiers
                foreach (PricingTier pricingTier in apiResponse.PricingTiers)
                {
                    Console.WriteLine(pricingTier);
                }
                
            }
            catch (Exception e)
            {
                Console.WriteLine("Exception occurred.");
                Console.WriteLine(e);
                Environment.Exit(1);
            }
        }
    }
}