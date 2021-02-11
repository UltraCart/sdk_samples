using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using NUnit.Framework;

namespace SdkSample.customer
{
    public class ValidateEmail
    {
        
        [Test]
        public void ExecuteTest()
        {
            var rand = new Random();
            string email = "test-" + rand.Next() + "@test.com";
            string password = rand.Next().ToString();
            string token = GetEmailValidationToken(email, password);
            
            // do whatever you wish with the token to validate.
            // send the customer an email with a link to your web site, etc.
            // once you get it back from the customer, validate that they actually received it.

            bool result = ValidateEmailValidationToken(token);
            
            Console.WriteLine($"email was successfully validated? {result}");
            
            // A customer placing an order is considered validated.  
            // A customer created via the backend web site or this SDK with the insertCustomer() is considered validated
            // A customer created via the GetEmailVerificationToken/ValidateEmailVerificationToken does not exist
            // in the customer tables until they are validated.  Until then, they are in a pending table.
            
            // Now that the customer is validated, query for them.
            Customer customer = GetCustomerByEmail.GetCustomerByEmailCall(email);
            Console.WriteLine(customer.ToString());

        }


        public static bool ValidateEmailValidationToken(string Token)
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";      
            var api = new CustomerApi(simpleKey);

            EmailVerifyTokenValidateRequest validateRequest 
                = new EmailVerifyTokenValidateRequest(){Token = Token};
            EmailVerifyTokenValidateResponse response = api.ValidateEmailVerificationToken(validateRequest);
            return response.Success ?? false;
        }
        
        
        
        public static string GetEmailValidationToken(string Email, string Password)
        {
            const string simpleKey = "109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00";      
            var api = new CustomerApi(simpleKey);

            EmailVerifyTokenRequest tokenRequest 
                = new EmailVerifyTokenRequest{Email = Email, Password = Password};
            EmailVerifyTokenResponse response = api.GetEmailVerificationToken(tokenRequest);
            return response.Token;
        }
        
        
    }
}