


using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample.checkout
{
    public class GetCartByCartId
    {

        [Test]
        public void ExecuteTest()
        {
            //TODO-PT
        }

        public static void GetCartByCartIdCall()
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
            var api = new CheckoutApi(simpleKey);
        }


    }
}
