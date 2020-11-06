using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  
  [TestFixture]
  public class GetOrdersTest {
    
    [Test]
    public void GetOrders()
    {
      
      
      const string simpleKey = "0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100";      
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      
      // This is required.  Search for 'Versioning' on this page:
      // https://www.ultracart.com/api/versioning.html
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");      
      
      var api = new OrderApi();
      string expand = "auto_order,item,summary";
      var email = "joh+test@energygps.com";
      email = "joh+cc2094594698@energygps.com";
      email = "test@test.com";
      int limit = 5;
      int counter = 1;

      OrdersResponse res = null;
      do
      {
        if (res == null) {
          res = api.GetOrders(email: email, limit: limit, expand: expand);
        } else {
          res = api.GetOrders(email: email, offset:
          res.Metadata.ResultSet.NextOffset, limit:
          res.Metadata.ResultSet.Limit, expand: expand);
          
        }
        foreach (var i in res.Orders)
        {
          Console.WriteLine((counter++) + " " + i.OrderId + " status=" + i.CurrentStage + " autoorder=" + i.AutoOrder?.Status);
          Console.WriteLine(i.ToJson());
        }
      }
      // while (false);
      while (res.Metadata.ResultSet.More ?? false);
      
      Console.WriteLine("Finished");      
    }    
    
  
    
    private static int Main() {

      const string simpleKey = "0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100";      
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      
      // This is required.  Search for 'Versioning' on this page:
      // https://www.ultracart.com/api/versioning.html
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");      
      
      var api = new OrderApi();
      const string expand = "auto_order,item,summary";
      var email = "joh+test@energygps.com";
      email = "joh+cc2094594698@energygps.com";
      email = "test@test.com";
      int limit = 5;
      int counter = 1;

      OrdersResponse res = null;
      do
      {
        if (res == null) {
          res = api.GetOrders(email: email, limit: limit, expand: expand);
        } else {
          res = api.GetOrders(email: email, offset:
            res.Metadata.ResultSet.NextOffset, limit:
            res.Metadata.ResultSet.Limit, expand: expand);
          
        }
        foreach (var i in res.Orders)
        {
          Console.WriteLine((counter++) + " " + i.OrderId + " status=" + i.CurrentStage + " autoorder=" + i.AutoOrder?.Status);
          Console.WriteLine(i.ToJson());

          // return 0;
        }
      }
      // while (false);
      while (res.Metadata.ResultSet.More ?? false);

      Console.WriteLine("Finished");
      return 0;
    }     
  }
}