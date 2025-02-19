using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.checkout
{
    public class GetStateProvincesForCountry
    {
        /// <summary>
        /// A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout
            // A simple method for populating the state_region list boxes with all the states/regions allowed for a country code.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            String countryCode = "US";

            CheckoutStateProvinceResponse apiResponse = checkoutApi.GetStateProvincesForCountry(countryCode);
            List<StateProvince> provinces = apiResponse.StateProvinces;

            foreach (StateProvince province in provinces)
            {
                Console.WriteLine(JsonConvert.SerializeObject(province,
                    new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }
        }
    }
}