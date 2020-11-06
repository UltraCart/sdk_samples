using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;

namespace SdkSample {
  public class HostedFields {

    private const string BaseAddress = "https://token.ultracart.com";
    private const string HostedFieldsPath = "/cgi-bin/UCCheckoutAPIHostedFields";
    private const string PublicKeyPath = "/cgi-bin/UCCheckoutAPIHostedFieldsPublicKey";
    private const string Referrer = "https://token.ultracart.com/";
    private static readonly Uri ReferrerUri = new Uri(Referrer);
    private const string Version = "1.0";

    // ReSharper disable once InconsistentNaming
    private const string OperationCVV = "storeCreditCardCvv2";

    // ReSharper disable once InconsistentNaming
    private const string OperationCC = "storeCreditCardNumber";


    public string MerchantId { get; set; }

    public string CartId { get; set; }

    //public string PublicKey { get; set; }
    public RSACryptoServiceProvider Rsa { get; set; }


    public static HostedFields Create(string merchantId) {
      return Create(merchantId, null);
    }


    public static HostedFields Create(string merchantId, string cartId) {
      var hostedFields =
        new HostedFields(merchantId, cartId) {Rsa = PemKeyUtils.GetRsaProviderFromPublicKey(GetPublicKey())};

      return hostedFields;
    }


    private HostedFields(string merchantId, string cartId) {
      MerchantId = merchantId;
      CartId = cartId;
    }


    private static string GetPublicKey() {

      var hc = new HttpClient {BaseAddress = new Uri(BaseAddress)};
      var result = hc.GetAsync(PublicKeyPath).Result;
      var key = result.Content.ReadAsStringAsync().Result;
      Console.WriteLine(key);
      return key;
    }


    private static JsonResult PostToTokenVault(HttpContent payload) {

      var hc = new HttpClient {BaseAddress = new Uri(BaseAddress)};

      hc.DefaultRequestHeaders.Referrer = ReferrerUri;
      var result = hc.PostAsync(HostedFieldsPath, payload).Result;

      var serializer = new DataContractJsonSerializer(typeof(JsonResult));
      var jsonResult = (JsonResult) serializer.ReadObject(result.Content.ReadAsStreamAsync().Result);

      Console.WriteLine($"PostJsonPayload Result: {jsonResult}");

      return jsonResult;
    }


    public JsonResult StoreNumber(string creditCardNumber) {

      Console.WriteLine($"Storing CC: {creditCardNumber}");

      var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
      Console.WriteLine($"Epoch: {epoch}");

      var timestamp = (long) (DateTime.UtcNow - epoch).TotalMilliseconds;
      Console.WriteLine($"Timestamp: {timestamp}");

      var unencryptedPayload = creditCardNumber + "|" + timestamp;
      Console.WriteLine($"Unencrypted Payload: {unencryptedPayload}");

      var encryptedBytes = Rsa.Encrypt(Encoding.ASCII.GetBytes(unencryptedPayload), false);
      //Console.WriteLine("Encrypted: " + Encoding.Default.GetString(encryptedBytes));

      var base64Payload = Convert.ToBase64String(encryptedBytes);
      Console.WriteLine("Base 64:");
      Console.WriteLine(base64Payload);

      var content = new List<KeyValuePair<string, string>>() {
        new KeyValuePair<string, string>("merchantId", MerchantId),
        new KeyValuePair<string, string>("operation", OperationCC),
        new KeyValuePair<string, string>("version", Version),
        new KeyValuePair<string, string>("creditCardNumberEncrypted", base64Payload),
        new KeyValuePair<string, string>("referrer", Referrer),
      };
      // if the card number belongs to a shopping cart, cart id should be provided.  if the card number will be used
      // to update an existing order, and auto order, and a customer profile (card already on file), then do not
      // provide a cart id and a token will be returned.  That token is then attached to the appropriate record and
      // the server side logic will retrieve the credit card from the token vault using the token as the key.
      if (CartId != null) {
        content.Add(new KeyValuePair<string, string>("shoppingCartId", CartId));
      }

      var formContent = new FormUrlEncodedContent(content.ToArray());


      return PostToTokenVault(formContent);

    }


    // ReSharper disable once InconsistentNaming
    public JsonResult StoreCVV(string cvv) {
      var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
      var timestamp = (long) (DateTime.UtcNow - epoch).TotalMilliseconds;
      var unencryptedPayload = cvv + "|" + timestamp;


      var encryptedBytes = Rsa.Encrypt(Encoding.ASCII.GetBytes(unencryptedPayload), false);
      var base64Payload = Convert.ToBase64String(encryptedBytes);

      var content = new List<KeyValuePair<string, string>>() {
        new KeyValuePair<string, string>("merchantId", MerchantId),
        new KeyValuePair<string, string>("operation", OperationCVV),
        new KeyValuePair<string, string>("version", Version),
        new KeyValuePair<string, string>("creditCardCvv2Encrypted", base64Payload),
        new KeyValuePair<string, string>("referrer", Referrer),
      };
      // if the card number belongs to a shopping cart, cart id should be provided.  if the card number will be used
      // to update an existing order, and auto order, and a customer profile (card already on file), then do not
      // provide a cart id and a token will be returned.  That token is then attached to the appropriate record and
      // the server side logic will retrieve the credit card from the token vault using the token as the key.
      if (CartId != null) {
        content.Add(new KeyValuePair<string, string>("shoppingCartId", CartId));
      }

      var formContent = new FormUrlEncodedContent(content.ToArray());

      return PostToTokenVault(formContent);

    }


    [DataContract]
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public class JsonResult {
      [DataMember] internal bool success;

      [DataMember] internal string maskedValue;

      [DataMember] internal string cardType;

      [DataMember] internal string token;

      [DataMember] internal string errorMessage;


      public override string ToString() {
        return
          $"{nameof(success)}: {success}, {nameof(maskedValue)}: {maskedValue}, {nameof(cardType)}: {cardType}, {nameof(token)}: {token}, {nameof(errorMessage)}: {errorMessage}";
      }

    }


//    private static int Main() {
//
//      Console.WriteLine("HostedFields.Main executing.");
//
//      const string merchantId = "DEMO";
//      const string cartId = "1234567890";
//
//      var hostedFields = Create(merchantId, cartId);
//
//
//      var ccResult = hostedFields.StoreNumber("4444333322221111");
//      Console.WriteLine("Result of Storing CC Number:");
//      Console.WriteLine(ccResult);
//
//      var cvvResult = hostedFields.StoreCVV("123");
//      Console.WriteLine("Result of Storing CVV Number:");
//      Console.WriteLine(cvvResult);
//
//      return 0;
//    }


  }
}