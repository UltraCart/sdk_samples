import {customerApi} from '../api';
import {
    EmailVerifyTokenRequest,
    EmailVerifyTokenResponse,
    EmailVerifyTokenValidateRequest,
    EmailVerifyTokenValidateResponse
} from 'ultracart_rest_api_v2_typescript';

export class GetEmailVerificationToken {
    /*
        GetEmailVerificationToken and ValidateEmailVerificationToken are tandem functions that allow a merchant to verify
        a customer's email address. GetEmailVerificationToken returns back a token that the merchant can use however
        they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
        it back into a website. Once the customer enters the token back into a site (along with their email),
        ValidateEmailVerificationToken will validate the token.

        Notice that GetEmailVerificationToken requires both the email and password.
     */
    public static async execute(): Promise<void> {
        const email = "test@ultracart.com";
        const password = "squirrel";

        const tokenRequest: EmailVerifyTokenRequest = {
            email: email,
            password: password
        };

        const tokenResponse: EmailVerifyTokenResponse = await customerApi.getEmailVerificationToken({
            tokenRequest: tokenRequest
        });
        const token = tokenResponse.token;

        // TODO - email the token to the customer, have them enter it back into another page...
        // TODO - verify the token with the following call

        const verifyRequest: EmailVerifyTokenValidateRequest = {
            token: token
        };
        const verifyResponse: EmailVerifyTokenValidateResponse = await customerApi.validateEmailVerificationToken({
            validationRequest: verifyRequest
        });

        console.log("Was the correct token provided? " + verifyResponse.success);
    }
}