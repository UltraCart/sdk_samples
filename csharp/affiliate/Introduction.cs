


using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample.affiliate
{
    public class Introduction
    {

        [Test]
        public void ExecuteTest()
        {
            //TODO-PT
        }

        public static void IntroductionCall()
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";
            var api = new AffiliateApi(simpleKey);
        }


    }
}
