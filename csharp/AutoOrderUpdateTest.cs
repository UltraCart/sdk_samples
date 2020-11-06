using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  [TestFixture]
  public class AutoOrderUpdateTest {

    
    
    [Test]
    public void GetAutoOrdersSince() {


      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

      var api = new AutoOrderApi();
      
      const string dateFormat = "yyyy-MM-ddTHH\\:mm\\:sszzz";
      api.GetAutoOrders(since: DateTime.Now.AddDays(+10000).ToString(dateFormat));
      

      const int autoOrderOid = 3268342;
      const string expansion = "items";
      var autoOrderResponse = api.GetAutoOrder(autoOrderOid, expansion);
      var autoOrder = autoOrderResponse.AutoOrder;
      
      var items = autoOrder.Items;
      
      // for the new item, set the next shipment date equal to the shipment date of the current items.
      // in case there are no items on this auto order (should *never* happen), start with a default of one month out.
      var nextShipmentDate =
        DateTime.UtcNow.AddMonths(1).ToString("s", System.Globalization.CultureInfo.InvariantCulture);

      if (items.Count > 0) {
        nextShipmentDate = items[0].NextShipmentDts;
      }
      
      
      var autoOrderItem = new AutoOrderItem {
        OriginalItemId = "PDF",
        OriginalQuantity = 2,
        RebillValue = decimal.Parse("34.23"),
        NextShipmentDts = nextShipmentDate
      };
      items.Add(autoOrderItem);

      autoOrderResponse = api.UpdateAutoOrder(autoOrder, autoOrderOid, expansion);
      autoOrder = autoOrderResponse.AutoOrder;

      Console.WriteLine(autoOrder);


    }    
    

    [Test]
    public void UpdateAutoOrder() {


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
      
      // for the new item, set the next shipment date equal to the shipment date of the current items.
      // in case there are no items on this auto order (should *never* happen), start with a default of one month out.
      var nextShipmentDate =
        DateTime.UtcNow.AddMonths(1).ToString("s", System.Globalization.CultureInfo.InvariantCulture);

      if (items.Count > 0) {
        nextShipmentDate = items[0].NextShipmentDts;
      }
      
      
      var autoOrderItem = new AutoOrderItem {
        OriginalItemId = "PDF",
        OriginalQuantity = 2,
        RebillValue = decimal.Parse("34.23"),
        NextShipmentDts = nextShipmentDate
      };
      items.Add(autoOrderItem);

      autoOrderResponse = api.UpdateAutoOrder(autoOrder, autoOrderOid, expansion);
      autoOrder = autoOrderResponse.AutoOrder;

      Console.WriteLine(autoOrder);


    }

    
    [Test]
    public void DeleteAutoOrderItem() {


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
      

      if (items.Count > 0) {
        items.Remove(items[items.Count - 1]);
      }
      
      
      autoOrderResponse = api.UpdateAutoOrder(autoOrder, autoOrderOid, expansion);
      autoOrder = autoOrderResponse.AutoOrder;

      Console.WriteLine(autoOrder);

    }
    

  }
}