using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using Newtonsoft.Json;

namespace SdkSample.order
{
    public class GetOrderByToken
    {
        /*
         * OrderApi.getOrderByToken() was created for use within a custom thank-you page.  The built-in StoreFront
         * thank you page displays the customer receipt and allows for unlimited customization.  However, many
         * merchants wish to process the receipt page on their own servers to do custom processing.
         *
         * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377199/Custom+Thank+You+Page+URL
         *
         * When setting up a custom thank-you url in the StoreFronts, you will provide a query parameter that will hold
         * this order token.  You many extract that from the Request.QueryString object, then turn around and call getOrderByToken
         * to get the order object.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            // The expansion variable instructs UltraCart how much information to return.  The order object is large and
            // while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
            // payload size.
            // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
            /*
            Possible Order Expansions:
            affiliate           affiliate.ledger                    auto_order
            billing             channel_partner                     checkout
            coupon              customer_profile                    digital_order
            edi                 fraud_score                         gift
            gift_certificate    internal                            item
            linked_shipment     marketing                           payment
            payment.transaction quote                               salesforce
            shipping            shipping.tracking_number_details    summary
            taxes
            */

            string expansion = "billing,checkout,coupon,customer_profile,item,payment,shipping,summary,taxes";

            // the token will be in a Request.QueryString parameter defined by you within your storefront.
            // StoreFront -> Privacy and Tracking -> Advanced -> CustomThankYouUrl
            // Example would be: www.mysite.com/receipt.aspx?OrderToken=[OrderToken]

            // Assuming this is an ASP.NET application and we're using Request.QueryString
            // string orderToken = Request.QueryString["OrderToken"];
            string orderToken = "DEMO:UZBOGywSKKwD2a5wx5JwmkwyIPNsGrDHNPiHfxsi0iAEcxgo9H74J/l6SR3X8g=="; // this won't work for you...
            // to generate an order token manually for testing, set generateOrderToken.cs
            // TODO (for you, the merchant): handle missing order token (perhaps this page somehow called by a search engine, etc).

            OrderByTokenQuery orderTokenQuery = new OrderByTokenQuery();
            orderTokenQuery.OrderToken = orderToken;
            OrderResponse apiResponse = orderApi.GetOrderByToken(orderTokenQuery, expansion);
            Order order = apiResponse.Order;

            Console.WriteLine(JsonConvert.SerializeObject(order, new JsonSerializerSettings { Formatting = Formatting.Indented}));
            
        }
    }
}