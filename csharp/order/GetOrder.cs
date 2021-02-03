using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample.order
{
    public class GetOrder
    {

        [Test]
        public void ExecuteTest()
        {
            Order order = GetOrderCall();
            Console.WriteLine(order.ToJson());
        }

        public static Order GetOrderCall()
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";      
            var api = new OrderApi(simpleKey);
            const string expansion = "item,summary";
            const string orderId = "DEMO-0009104309";

            OrderResponse res = api.GetOrder(orderId, expansion);
            return res.Order;
        }
        
        
    }
}