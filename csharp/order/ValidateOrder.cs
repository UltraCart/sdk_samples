using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class ValidateOrder
    {
        /*
            validateOrder may be used to check for any and all validation errors that may result from an insertOrder
            or updateOrder call. Because those method are built on our existing infrastructure, some validation
            errors may not bubble up to the rest api call and instead be returned as generic "something went wrong" errors.
            This call will return detail validation issues needing correction.

            Within the ValidationRequest, you may leave the 'checks' array null to check for everything, or pass
            an array of the specific checks you desire. Here is a list of the checks:

            "Billing Address Provided"
            "Billing Destination Restriction"
            "Billing Phone Numbers Provided"
            "Billing State Abbreviation Valid"
            "Billing Validate City State Zip"
            "Email provided if required"
            "Gift Message Length"
            "Item Quantity Valid"
            "Items Present"
            "Merchant Specific Item Relationships"
            "One per customer violations"
            "Referral Code Provided"
            "Shipping Address Provided"
            "Shipping Destination Restriction"
            "Shipping Method Ignore Invalid"
            "Shipping Method Provided"
            "Shipping State Abbreviation Valid"
            "Shipping Validate City State Zip"
            "Special Instructions Length"
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string expansion = "checkout"; // see the getOrder sample for expansion discussion

            string orderId = "DEMO-0009104976";
            Order order = orderApi.GetOrder(orderId, expansion).Order;

            Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));

            // TODO: do some updates to the order.
            OrderValidationRequest validationRequest = new OrderValidationRequest();
            validationRequest.Order = order;
            validationRequest.Checks = null; // leaving this null to perform all validations.

            OrderValidationResponse apiResponse = orderApi.ValidateOrder(validationRequest);

            Console.WriteLine("Validation errors:");
            if (apiResponse.Errors != null)
            {
                foreach (string error in apiResponse.Errors)
                {
                    Console.WriteLine($"- {error}");
                }
            }
            else
            {
                Console.WriteLine("No validation errors found.");
            }

            Console.WriteLine("\nValidation messages:");
            if (apiResponse.Messages != null)
            {
                foreach (string message in apiResponse.Messages)
                {
                    Console.WriteLine($"- {message}");
                }
            }
            else
            {
                Console.WriteLine("No validation messages found.");
            }
        }
    }
}