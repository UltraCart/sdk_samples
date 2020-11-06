using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  
  [TestFixture]
  public class QueryAutoOrdersByEmail {
   

    

    /// <summary>
    /// Helper method to loop through a (possibly, be extremely doubtful) large auto order set and return back a chunk of it.
    /// See the Main method for its usage.
    /// See https://www.ultracart.com/api/#resource_auto_order.html
    /// </summary>
    /// <param name="api">AutoOrderApi reference</param>
    /// <param name="email">email to filter by</param>
    /// <param name="offset">The record offset.  First execution this will be zero, and then increment 
    /// by the number of records returned each iteration.</param>
    /// <param name="limit">Default and maximum is 200 records.  The example below uses 100.</param>
    /// <returns>
    /// A list of UltraCart AutoOrders.
    /// </returns>
    private static List<AutoOrder> GetAutOrdersChunk(AutoOrderApi api, string email, int offset = 0, int limit = 200) {

      const string expand = "items,rebill_orders,original_order"; 

      var autoOrderResponse = api.GetAutoOrders(email: email, offset: offset, limit: limit, expand: expand);
      // TODO if the response is not success, handle errors here.      
      return autoOrderResponse.Success == true ? autoOrderResponse.AutoOrders : new List<AutoOrder>();

    }

    
    [Test]
    public void GetAutoOrders() {

      // See https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/158597140/C+SDK+Sample+Initializing+Routine
      UltraCartInit.Init();      
      
      var api = new AutoOrderApi();
      var offset = 0;
      const int limit = 100; // why 100?  Just to show more looping.  200 is the max and a better choice.
      var stillMoreRecords = true;
      var autoOrders = new List<AutoOrder>();
      const string email = "test@test.com";

      while (stillMoreRecords) {
        var chunkOfAutoOrders = GetAutOrdersChunk(api, email, offset, limit);
        Console.WriteLine($"{chunkOfAutoOrders.Count} auto orders retrieved.");
        autoOrders.AddRange(chunkOfAutoOrders);
        offset += limit;
        stillMoreRecords = chunkOfAutoOrders.Count == limit;

      }

      Console.WriteLine($"{autoOrders.Count} total auto orders retrieved.");

    }    

  }
}