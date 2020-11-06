using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample {
  // This sample uses NUnit Framework
  [TestFixture]
  public class UpdateCustomerCreditCard {


    private Customer CreateNewCustomer(CustomerApi api) {

      var random = new Random();
      var i = random.Next();

      Customer customer = new Customer {
        Email = "sample" + i + "@ultracart.com",
        Password = "change_me"
      };

      CustomerResponse response = api.InsertCustomer(customer);
      return response.Customer;
    }


    // HostedFields code:
    // https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/160235523/C+SDK+Sample+Hosted+Fields+Credit+Card+Numbers
    private HostedFields.JsonResult UploadCardNumber(string merchantId, string cardNumber) {
      HostedFields hostedFields = HostedFields.Create(merchantId);
      return hostedFields.StoreNumber(cardNumber);
    }


    [Test]
    public void AddTwoCreditCards() {


      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

      var api = new CustomerApi();

      Customer customer = CreateNewCustomer(api);

      // add a credit card.
      // use hosted fields to upload the credit card numbers.
      // See: https://github.com/UltraCart/hosted_fields

      const string merchantId = "DEMO";

      const string cardNumber1 = "4444333322221111";
      const int expYear1 = 2025;
      const int expMonth1 = 2;
      HostedFields.JsonResult uploadResult1 = UploadCardNumber(merchantId, cardNumber1);

      CustomerCard card1 = new CustomerCard {
        CardExpirationMonth = expMonth1,
        CardExpirationYear = expYear1,
        CardNumberToken = uploadResult1.token,
        CardNumber = uploadResult1.maskedValue,
        CardType = uploadResult1.cardType
      };


      const string cardNumber2 = "4111111111111111";
      const int expYear2 = 2027;
      const int expMonth2 = 6;
      HostedFields.JsonResult uploadResult2 = UploadCardNumber(merchantId, cardNumber2);

      CustomerCard card2 = new CustomerCard {
        CardExpirationMonth = expMonth2,
        CardExpirationYear = expYear2,
        CardNumberToken = uploadResult2.token,
        CardNumber = uploadResult2.maskedValue,
        CardType = uploadResult2.cardType
      };

      customer.Cards = new List<CustomerCard> {card1, card2};

      String expansion = "billing,shipping,cards,pricing_tiers";
      CustomerResponse customerResponse = api.UpdateCustomer(customer, customer.CustomerProfileOid, expansion);

      if (customerResponse.Success == true) {
        Console.WriteLine(customerResponse.Customer);
      }
      else {
        Console.WriteLine(customerResponse.Error.ErrorCode);
        Console.WriteLine(customerResponse.Error.DeveloperMessage);
        Console.WriteLine(customerResponse.Error.UserMessage);
        Console.WriteLine(customerResponse.Error.MoreInfo);
      }      

    }

    
    
    
    [Test]
    public void UpdateCreditCard() {


      // See https://secure.ultracart.com/merchant/configuration/apiManagementApp.do
      const string simpleKey = "508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00";
      Configuration.Default.ApiKey.Add("x-ultracart-simple-key", simpleKey);
      Configuration.Default.DefaultHeader.Add("X-UltraCart-Api-Version", "2017-03-01");

      var api = new CustomerApi();

      const int sampleCustomerProfileId = 3336562;
      const string expansion = "billing,shipping,cards,pricing_tiers";
      CustomerResponse customerResponse = api.GetCustomer(sampleCustomerProfileId, expansion);
      Customer customer = customerResponse.Customer;
      
      // I know this customer has a credit card on file.
      CustomerCard card = customer.Cards[0];

      card.CardExpirationMonth = 12;
      card.CardExpirationYear = 2035;
      
      customerResponse = api.UpdateCustomer(customer, customer.CustomerProfileOid, expansion);

      if (customerResponse.Success == true) {
        Console.WriteLine(customerResponse.Customer);
      }
      else {
        Console.WriteLine(customerResponse.Error.ErrorCode);
        Console.WriteLine(customerResponse.Error.DeveloperMessage);
        Console.WriteLine(customerResponse.Error.UserMessage);
        Console.WriteLine(customerResponse.Error.MoreInfo);
      }

    }
        
  }

}