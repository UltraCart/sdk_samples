using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.checkout
{
    public class GetAllowedCountries
    {
        /// <summary>
        /// A simple method for populating the country list boxes with all the countries this merchant has configured to accept.
        /// </summary>
        public static void Execute()
        {
            // Reference Implementation: https://github.com/UltraCart/responsive_checkout
            // A simple method for populating the country list boxes with all the countries this merchant has configured to accept.

            CheckoutApi checkoutApi = new CheckoutApi(Constants.ApiKey);

            CheckoutAllowedCountriesResponse apiResponse = checkoutApi.GetAllowedCountries();
            List<Country> allowedCountries = apiResponse.Countries;

            foreach (Country country in allowedCountries)
            {
                Console.WriteLine(JsonConvert.SerializeObject(country, new JsonSerializerSettings { Formatting = Formatting.Indented}));
            }
        }
    }
}