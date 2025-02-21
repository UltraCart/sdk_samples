package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.EmailVerifyTokenRequest;
import com.ultracart.admin.v2.models.EmailVerifyTokenResponse;
import com.ultracart.admin.v2.models.EmailVerifyTokenValidateRequest;
import com.ultracart.admin.v2.models.EmailVerifyTokenValidateResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

/*
    GetEmailVerificationToken and ValidateEmailVerificationToken are tandem functions that allow a merchant to verify
    a customer's email address. GetEmailVerificationToken returns back a token that the merchant can use however
    they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
    it back into a website. Once the customer enters the token back into a site (along with their email),
    ValidateEmailVerificationToken will validate the token.

    Notice that GetEmailVerificationToken requires both the email and password.
 */
public class GetEmailVerificationToken {
    public static void execute() {
        CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

        String email = "test@ultracart.com";
        String password = "squirrel";

        EmailVerifyTokenRequest tokenRequest = new EmailVerifyTokenRequest();
        tokenRequest.email(email);
        tokenRequest.password(password);

        try {
            EmailVerifyTokenResponse tokenResponse = customerApi.getEmailVerificationToken(tokenRequest);
            String token = tokenResponse.getToken();

            // TODO - email the token to the customer, have them enter it back into another page...
            // TODO - verify the token with the following call

            EmailVerifyTokenValidateRequest verifyRequest = new EmailVerifyTokenValidateRequest();
            verifyRequest.token(token);
            EmailVerifyTokenValidateResponse verifyResponse = customerApi.validateEmailVerificationToken(verifyRequest);

            System.out.println("Was the correct token provided? " + verifyResponse.getSuccess());
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }
}