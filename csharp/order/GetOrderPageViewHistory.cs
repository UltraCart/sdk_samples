using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrderPageViewHistory
    {
        /*
            getOrderPageViewHistory returns the page views captured during the session that placed an
            order, along with the referrer that started that session.

            A customer profile is NOT required.  These page views are keyed off an analytics client id
            stored on the order itself, so this works for guest orders.  For the email engagement side of
            customer activity, use GetOrderCustomerActivity instead.

            An order placed outside the storefront, such as a phone order or an order imported from a
            channel partner, will have no analytics session attached.  In that case PageViews comes back
            empty.  That is a successful response rather than an error.

            Note: ViewDts is an ISO 8601 string here.  Be aware that the Ts field on
            GetOrderCustomerActivity is unix milliseconds instead, so do not assume the two methods format
            dates the same way.

            Possible Errors:
            order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            string orderId = "DEMO-0009104976";
            OrderPageViewHistoryResponse response = orderApi.GetOrderPageViewHistory(orderId);

            Console.WriteLine("Session referrer: " + (response.Referrer ?? "(none captured)"));

            List<OrderPageView> pageViews = response.PageViews;

            if (pageViews == null || pageViews.Count == 0)
            {
                Console.WriteLine("No page views were captured for this order.");
                return;
            }

            foreach (OrderPageView pageView in pageViews)
            {
                Console.WriteLine(JsonConvert.SerializeObject(pageView,
                    new JsonSerializerSettings { Formatting = Formatting.Indented }));
            }

        }
    }
}
