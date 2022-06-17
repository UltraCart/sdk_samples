Hello.  The samples contained within this project are meant to help you use our SDKs to access UltraCart.

Our REST API is documented here: https://www.ultracart.com/api/#introduction.html

**This is a work in progress.  We're creating examples as requested or when time permits.**

If you need an example, please email our support and we'll work to assist you. 
If you wish to just see how it's done, check out the gift_certificate folder for any language.  As our newest api, the gift certificate api is fully documented.

### Our SDK Source Code


| Language  | Repository                                                |
|-----------|-----------------------------------------------------------|
| C#        | https://github.com/UltraCart/rest_api_v2_sdk_csharp       |
| Java      | https://github.com/UltraCart/rest_api_v2_sdk_java         |
| Javascript| https://github.com/UltraCart/rest_api_v2_sdk_javascript   |
| PHP       | https://github.com/UltraCart/rest_api_v2_sdk_php          |
| Python    | https://github.com/UltraCart/rest_api_v2_sdk_python       |
| Ruby      | https://github.com/UltraCart/rest_api_v2_sdk_ruby         |

### Our SDK Packages


| Language  | Package                                                        |
|-----------|----------------------------------------------------------------|
| C#        | https://www.nuget.org/packages/com.ultracart.admin.v2/         |
| Java      | https://mvnrepository.com/artifact/com.ultracart/rest-sdk      |
| Javascript| https://www.npmjs.com/package/ultra_cart_rest_api_v2           | 
| PHP       |   https://packagist.org/packages/ultracart/rest_api_v2_sdk_php |
| Python    |  https://pypi.org/project/ultracart-rest-sdk/                  |
| Ruby      |  https://rubygems.org/gems/ultracart_api                       |


# Example: Retrieving a Gift Certificate
<details>
   <summary>C#</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/csharp/gift_certificate/GetGiftCertificateByCode.cs) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/csharp/gift_certificate/GetGiftCertificateByCode.cs -->
   ```cs
   using com.ultracart.admin.v2.Api;
   using com.ultracart.admin.v2.Model;
   
   namespace SdkSample.gift_certificate
   {
       // ReSharper disable once ClassNeverInstantiated.Global
       public class GetGiftCertificateByCode
       {
           // uncomment to run.  C# projects can only have one main.
           // public static void Main()
           // {
           //     var giftCertificate = GetGiftCertificateByCodeCall();
           //     Utility.DumpObject(giftCertificate, "Gift Certificate");
           // }
   
           // ReSharper disable once MemberCanBePrivate.Global
           public static GiftCertificate GetGiftCertificateByCodeCall()
           {
               var api = new GiftCertificateApi(Constants.API_KEY);
               
               const string code = "X8PV761V2Z";
   
               // by_code does not take an expansion variable.  it will return the entire object by default.
               var gcResponse = api.GetGiftCertificateByCode(code);
               return gcResponse.GiftCertificate;
           }
       }
   }
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

<details>
   <summary>Java</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/java/src/gift_certificate/GetGiftCertificateByCode.java) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/java/src/gift_certificate/GetGiftCertificateByCode.java -->
   ```java
   package gift_certificate;
   
   import com.ultracart.admin.v2.GiftCertificateApi;
   import com.ultracart.admin.v2.models.GiftCertificate;
   import com.ultracart.admin.v2.models.GiftCertificateResponse;
   import common.Constants;
   import common.JSON;
   
   public class GetGiftCertificateByCode{
   
     public static void main(String ... args) throws Exception {
   
       GiftCertificateApi giftCertificateApi = new GiftCertificateApi(Constants.API_KEY);
   
       String code = "93KHHXD6VH";
   
       // by_code does not take an expansion variable.  it will return the entire object by default.
       GiftCertificateResponse gcResponse = giftCertificateApi.getGiftCertificateByCode(code);
       GiftCertificate giftCertificate = gcResponse.getGiftCertificate();
   
       System.out.println(JSON.toJSON(giftCertificate));
   
     }
   
   }
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

<details>
   <summary>JavaScript</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/javascript/gift_certificate/getGiftCertificateByCode.js) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/javascript/gift_certificate/getGiftCertificateByCode.js -->
   ```js
   var ucApi = require('ultra_cart_rest_api_v2');
   const { apiClient } = require('../api.js');
   
   var giftCertificateApi = new ucApi.GiftCertificateApi(apiClient);
   
   let code = 'NRQPHPCFVK';
   
   
   // by_code does not take an expansion variable.  it will return the entire object by default.
   giftCertificateApi.getGiftCertificateByCode(code, 
       function(error, data, response){
           let giftCertificate = data.gift_certificate;    
           console.log('giftCertificate', giftCertificate);
       });
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

<details>
   <summary>PHP</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/php/gift_certificate/getGiftCertificateByCode.php) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/php/gift_certificate/getGiftCertificateByCode.php -->
   ```php
   <?php
   require_once '../vendor/autoload.php';
   require_once '../constants.php';
   
   
   $gift_certificate_api = ultracart\v2\api\GiftCertificateApi::usingApiKey(Constants::API_KEY);
   
   $code = "93KHHXD6VH";
   
   // by_code does not take an expansion variable.  it will return the entire object by default.
   $api_response = $gift_certificate_api->getGiftCertificateByCode($code);
   
   
   echo '<html lang="en"><body><pre>';
   var_dump($api_response);
   var_dump($api_response->getGiftCertificate());
   echo '</pre></body></html>';
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

<details>
   <summary>Python</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/python/gift_certificate/get_gift_certificate_by_code.py) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/python/gift_certificate/get_gift_certificate_by_code.py -->
   ```py
   # get a gift certificate by code.
   
   import ultracart
   from ultracart.rest import ApiException
   from ultracart import ApiClient
   from pprint import pprint
   
   config = ultracart.Configuration()
   # this key is valid only in the UltraCart development system.  You need to supply a valid simple key here.
   config.api_key['x-ultracart-simple-key'] \
       = 'a84dba2b20613c017eff4a1185380100a385a6ff6f6939017eff4a1185380100'
   config.debug = False
   config.verify_ssl = False  # Development only.  Set to True for production.
   
   api_client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
   api_instance = ultracart.GiftCertificateApi(api_client)
   
   try:
   
       code = 'NRQPHPCFVK'
   
       # by_code does not take an expansion variable.  it will return the entire object by default.
       gc_response = api_instance.get_gift_certificate_by_code(code)
       gift_certificate = gc_response.gift_certificate
   
       pprint(gift_certificate)
   
   except ApiException as e:
       print("Exception when calling GiftCertificateApi->get_gift_certificate_by_code: %s\n" % e)
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

<details>
   <summary>Ruby</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/ruby/gift_certificate/get_gift_certificate_by_code.rb) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/ruby/gift_certificate/get_gift_certificate_by_code.rb -->
   ```rb
   require 'json'
   require 'yaml'
   require 'ultracart_api'
   require '../Constants'
   
   api = UltracartClient::GiftCertificateApi.new_using_api_key(Constants::API_KEY)
   
   code = '74BX2Q8B7K'
   
   # by_code does not take an expansion variable.  it will return the entire object by default.
   api_response = api.get_gift_certificate_by_code(code)
   gift_certificate = api_response.gift_certificate
   
   puts gift_certificate.to_yaml
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

<details>
   <summary>Typescript</summary>

   <!-- MARKDOWN-AUTO-DOCS:START (CODE:src=https://raw.githubusercontent.com/UltraCart/sdk_samples/master/typescript/gift_certificate/getGiftCertificateByCode.ts) -->
   <!-- The below code snippet is automatically added from https://raw.githubusercontent.com/UltraCart/sdk_samples/master/typescript/gift_certificate/getGiftCertificateByCode.ts -->
   ```ts
   // I'm using the .js extension here so this file can be run stand-alone using node. Normally, there would be no extension.
   import { giftCertificateApi } from '../api.js';
   // import { giftCertificateApi } from '../api';
   
   
   let code = 'NRQPHPCFVK'
   
   // by_code does not take an expansion variable.  it will return the entire object by default.
   let gcResponse = await giftCertificateApi.getGiftCertificateByCode(code);
   let giftCertificate = gcResponse.gift_certificate;
   
   console.log(giftCertificate);
   ```
   <!-- MARKDOWN-AUTO-DOCS:END -->

</details>

