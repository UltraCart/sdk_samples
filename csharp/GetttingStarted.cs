// You must create your own Simple API key for this example to work.
// See the comments below.

using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;

namespace SdkSample {
  public class GettingStarted {

    /// <summary>
    /// Helper method to loop through a large customer record set and return back a chunk of it.
    /// See the Main method for its usage.
    /// See https://www.ultracart.com/api/#resource_customer.html
    /// See https://www.ultracart.com/api/#Operation1 for the /customer/customers REST call.
    /// </summary>
    /// <param name="api">CustomerApi reference</param>
    /// <param name="offset">The record offset.  First execution this will be zero, and then increment 
    /// by the number of records returned each iteration.</param>
    /// <param name="limit">Default and maximum is 200 records.  The example below uses 100.</param>
    /// <returns>
    /// A list of UltraCart customer profiles.  These are NOT records.  They are customer profiles.  
    /// If a customer places an order and does not create a customer profile, they will not appear in this list.
    /// </returns>
    private static List<Customer> GetCustomerChunk(CustomerApi api, int offset = 0, int limit = 200) {

      // string expand = null; // no expansion.  bare bones.  you will rarely want this.
      const string expand = "shipping,billing"; // shipping and billing addresses
      // string expand = "shipping,billing,cards,pricing_tiers"; // everything.

      var customerResponse = api.GetCustomers(offset: offset, limit: limit, expand: expand);
      // TODO if the response is not success, handle errors here.      
      return customerResponse.Success == true ? customerResponse.Customers : new List<Customer>();

    }

    
    
//    private static int Main() {
//
//      // API Simple Keys Documentation
//      // https://ultracart.atlassian.net/wiki/display/ucdoc/API+Simple+Key
//      //
//      // This is the backend screen where API keys are created.
//      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
//      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";      
//      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
//      
//      // This is required.  Search for 'Versioning' on this page:
//      // https://www.ultracart.com/api/versioning.html
//      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");
//
//      var api = new CustomerApi();
//      var offset = 0;
//      const int limit = 100; // why 100?  Just to show more looping.  200 is the max and a better choice.
//      var stillMoreRecords = true;
//      var customers = new List<Customer>();
//
//      while (stillMoreRecords) {
//        var chunkOfCustomers = GetCustomerChunk(api, offset, limit);
//        Console.WriteLine($"{chunkOfCustomers.Count} customers retrieved.");
//        customers.AddRange(chunkOfCustomers);
//        offset += limit;
//        stillMoreRecords = chunkOfCustomers.Count == limit;
//
//      }
//
//      Console.WriteLine($"{customers.Count} total customers retrieved.");
//
//      return 0;
//    }    

  }
}