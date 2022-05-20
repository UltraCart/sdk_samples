


using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample.storefront
{
    public class GetEmailFlowFolder
    {

        [Test]
        public void ExecuteTest()
        {
            // Please see the README.md in this directory for an explanation about StoreFrontApi samples.
        }

        public static void GetEmailFlowFolderCall()
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
            var api = new StorefrontApi(simpleKey);
        }


    }
}
