using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrderCustomerActivity
    {
        /*
            getOrderCustomerActivity returns the customer activity associated with the email address on an
            order.  This includes email engagement history, email list and segment membership, lifetime
            metrics and email suppression status.

            A customer profile is NOT required and is not consulted.  The activity is keyed off the email
            address on the order, so this works for guest orders that have never had a customer profile
            established.  For the page views captured during the session that placed the order, use
            GetOrderPageViewHistory instead.

            If the order has no valid email address, Email and CustomerActivity both come back null.  That
            is a successful response rather than an error - without an email there is no activity record
            to find.

            Note: Activity.Ts is a unix timestamp in milliseconds, not an ISO 8601 string like most dates
            in this API.

            Possible Errors:
            order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104976";
            OrderCustomerActivityResponse response = orderApi.GetOrderCustomerActivity(orderId);

            Console.WriteLine("Customer activity for: " + response.Email);

            CustomerActivity customerActivity = response.CustomerActivity;

            if (customerActivity == null)
            {
                Console.WriteLine("No customer activity found for this order.");
                return;
            }

            Console.WriteLine("Globally unsubscribed: " + customerActivity.GlobalUnsubscribed);
            Console.WriteLine("Spam complaint: " + customerActivity.SpamComplaint);

            List<Activity> activities = customerActivity.Activities;

            foreach (Activity activity in activities)
            {
                Console.WriteLine(JsonConvert.SerializeObject(activity,
                    new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }

        }
    }
}
