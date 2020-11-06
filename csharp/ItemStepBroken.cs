using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {

  [TestFixture]
  public class ItemStepBroken {

    [Test]
    public static void ItemStepBrokenFunc() {

      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);

      // This is required.  Search for 'Versioning' on this page:
      // https://www.ultracart.com/api/versioning.html
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

      var expansion = "auto_order,auto_order.steps";

      Random rand = new Random();
      var itemCode = "ItemStepBroken" + rand.Next();
      var api = new ItemApi();

      //Create item first. You can't create AutoOrder until item is created.
      var i = new Item {MerchantItemId = itemCode};
      var ir = api.InsertItem(i, expansion);
      Console.WriteLine("InsertItem=" + ir.ToJson());

      //Update the steps for AutoOrder
      ir.Item.AutoOrder = new ItemAutoOrder {
        AutoOrderable = true,
        AutoOrderUpsell = true,
        Steps = new List<ItemAutoOrderStep> {
          new ItemAutoOrderStep {
            Type = ItemAutoOrderStep.TypeEnum.Item,
            Schedule = "Monthly",
            RecurringMerchantItemId = ir.Item.MerchantItemId,
            RecurringMerchantItemOid = ir.Item.MerchantItemOid
          }
        }
      };
      Console.WriteLine("Item to update=" + ir.Item.ToJson());
      ir = api.UpdateItem(ir.Item, ir.Item.MerchantItemOid, expand: expansion);
      Console.WriteLine("UpdateItem=" + ir.ToJson());
    }


  }
}