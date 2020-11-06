using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  [TestFixture]
  public class QueryAutoOrderWithItemOptionsTest {

    [Test]
    public void QueryAutoOrderAndDisplayItemOptions() {

      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

      var api = new AutoOrderApi();

      const int autoOrderOid = 3268342;
      const string expansion = "items";
      var autoOrderResponse = api.GetAutoOrder(autoOrderOid, expansion);
      var autoOrder = autoOrderResponse.AutoOrder;
      
      var items = autoOrder.Items;
      
      // add some options to each item.  for this sample, we'll just make some up.
      var i = 0;
      foreach (var item in items) {
        item.Options = new List<AutoOrderItemOption>() {
          new AutoOrderItemOption(){Label = "Label" + i, Value = "Value" + i},
          new AutoOrderItemOption(){Label = "AnotherLabel" + i, Value = "AnotherValue" + i},
          new AutoOrderItemOption(){Label = "ThirdLabel" + i, Value = "ThirdValue" + i}
        };
        i++;
      }
      

      autoOrderResponse = api.UpdateAutoOrder(autoOrder, autoOrderOid, expansion);      
      autoOrder = autoOrderResponse.AutoOrder;


      foreach (var item in autoOrder.Items) {
        foreach (var option in item.Options) {
          Console.WriteLine($"{item.OriginalItemId}: Label:{option.Label} => Value: {option.Value}");
        }
      }                  
    }


  }
}