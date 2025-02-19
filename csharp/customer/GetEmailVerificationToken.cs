using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.customer
{
    public class GetEmailVerificationToken
    {
        /*
            GetEmailVerificationToken and ValidateEmailVerificationToken are tandem functions that allow a merchant to verify
            a customer's email address. GetEmailVerificationToken returns back a token that the merchant can use however
            they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
            it back into a website. Once the customer enters the token back into a site (along with their email),
            ValidateEmailVerificationToken will validate the token.

            Notice that GetEmailVerificationToken requires both the email and password.
         */
        public static void Execute()
        {
            CustomerApi customerApi = new CustomerApi(Constants.ApiKey);

            string email = "test@ultracart.com";
            string password = "squirrel";

            EmailVerifyTokenRequest tokenRequest = new EmailVerifyTokenRequest();
            tokenRequest.Email = email;
            tokenRequest.Password = password;

            EmailVerifyTokenResponse tokenResponse = customerApi.GetEmailVerificationToken(tokenRequest);
            string token = tokenResponse.Token;

            // TODO - email the token to the customer, have them enter it back into another page...
            // TODO - verify the token with the following call

            EmailVerifyTokenValidateRequest verifyRequest = new EmailVerifyTokenValidateRequest();
            verifyRequest.Token = token;
            EmailVerifyTokenValidateResponse verifyResponse = customerApi.ValidateEmailVerificationToken(verifyRequest);

            Console.WriteLine("Was the correct token provided? " + verifyResponse.Success);
        }
    }
}