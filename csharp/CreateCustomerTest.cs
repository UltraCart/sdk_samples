using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  // This sample uses NUnit Framework
  [TestFixture]
  public class CreateCustomerTest {


      [Test]
      public void CreateCustomer() {


        // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
        const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
        Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
        Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

        var api = new CustomerApi();

        var random = new Random();
        var i = random.Next();
        
        Customer customer = new Customer {
          Email = "sample" + i + "@ultracart.com", 
          Password = "change_me"          
        };

        var billing = new List<CustomerBilling>();        
        billing.Add(new CustomerBilling() {
          FirstName = "John"
        });
        customer.Billing = billing;

        CustomerResponse response = api.InsertCustomer(customer);
        
        

        if (response.Success == true) {
          Console.WriteLine(response.Customer);
        }
        else {
          Console.WriteLine(response.Error.ErrorCode);
          Console.WriteLine(response.Error.DeveloperMessage);          
          Console.WriteLine(response.Error.UserMessage);
          Console.WriteLine(response.Error.MoreInfo);
        }
                
      }

    }
 
}