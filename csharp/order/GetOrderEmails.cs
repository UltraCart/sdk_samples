using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrderEmails
    {
        /*
            getOrderEmails returns the delivery records for every email UltraCart sent regarding an order,
            oldest first.  Each record carries the subject and send time plus delivery, open, click and
            bounce status, which makes this useful evidence that a customer was notified about their
            order.

            A customer profile is NOT required.  These records are tied to the order id itself.

            An order with no email history, or one whose emails were all suppressed, comes back with an
            empty Emails list.  That is a successful response rather than an error.

            The Internal flag marks messages sent to merchant staff rather than to the customer.  Filter
            those out if you only want what the customer actually received.

            Possible Errors:
            order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104976";
            OrderEmailsResponse response = orderApi.GetOrderEmails(orderId);
            List<OrderEmail> emails = response.Emails;

            if (emails == null || emails.Count == 0)
            {
                Console.WriteLine("No emails were sent for this order.");
                return;
            }

            foreach (OrderEmail email in emails)
            {
                Console.WriteLine(JsonConvert.SerializeObject(email,
                    new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }

        }
    }
}
