using System;
using com.ultracart.admin.v2.Api;

namespace SdkSample
{
    public class Samples
    {
        public static GiftCertificateApi GetGiftCertificateApi()
        {
            return new GiftCertificateApi(Constants.ApiKey);
        }

        public static OrderApi GetOrderApi()
        {
            return new OrderApi(Constants.ApiKey);
        }

        public static ItemApi GetItemApi()
        {
            return new ItemApi(Constants.ApiKey);
        }

        public static CustomerApi GetCustomerApi()
        {
            return new CustomerApi(Constants.ApiKey);
        }

        public static AutoOrderApi GetAutoOrderApi()
        {
            return new AutoOrderApi(Constants.ApiKey);
        }

        public static FulfillmentApi GetFulfillmentApi()
        {
            return new FulfillmentApi(Constants.ApiKey);
        }
    }
}