using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  [TestFixture]
  public class CustomerApiTest {

    private static List<Customer> GetCustomerChunk(ICustomerApi api, int offset = 0, int limit = 200) {

      // string expand = null; // no expansion.  bare bones.
      const string expand = "shipping,billing"; // shipping and billing addresses
      // string expand = "shipping,billing,cards,pricing_tiers"; // everything.

      var customerResponse = api.GetCustomers(offset: offset, limit: limit, expand: expand);
      // TODO if the response is not success, handle errors here.      
      return customerResponse.Success == true ? customerResponse.Customers : new List<Customer>();

    }


    [Test]
    public void GetCustomersTest() {


      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

      var api = new CustomerApi();
      var offset = 0;
      const int limit = 100; // why 100?  Just to show more looping.  200 is the max and a better choice.
      var stillMoreRecords = true;
      var customers = new List<Customer>();

      while (stillMoreRecords) {
        var chunkOfCustomers = GetCustomerChunk(api, offset, limit);
        Console.WriteLine($"{chunkOfCustomers.Count} customers retrieved.");
        customers.AddRange(chunkOfCustomers);
        offset += limit;
        stillMoreRecords = chunkOfCustomers.Count == limit;

      }

      Console.WriteLine($"{customers.Count} total customers retrieved.");

    }


  }
}