using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class IsRefundableOrder
    {
        /*
            isRefundable queries the UltraCart system whether an order is refundable or not.
            In addition to a simple boolean response, UltraCart also returns back any reasons why
            an order is not refundable.
            Finally, the response also contains any refund or return reasons configured on the account in the event
            that this merchant account is configured to require a reason for a return or refund.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104976";
            OrderRefundableResponse refundableResponse = orderApi.IsRefundableOrder(orderId);
            Console.WriteLine($"Is Refundable: {refundableResponse.Refundable}");

            // the response contains dropdown values and additional information.  It's much more than a true/false flag.
            Console.WriteLine("API Response:");
            Console.WriteLine(JsonConvert.SerializeObject(refundableResponse, new JsonSerializerSettings { Formatting = Formatting.Indented}));            
        }
    }
}