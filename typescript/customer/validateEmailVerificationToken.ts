import {
    CustomerApi,
    EmailVerifyTokenRequest,
    EmailVerifyTokenResponse,
    EmailVerifyTokenValidateRequest,
    EmailVerifyTokenValidateResponse
} from 'ultracart_rest_api_v2_typescript';
import {customerApi} from '../api';

export class ValidateEmailVerificationToken {
    /**
     * GetEmailVerificationToken and ValidateEmailVerificationToken are tandem functions that allow a merchant to verify
     * a customer's email address. GetEmailVerificationToken returns back a token that the merchant can use however
     * they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
     * it back into a website.  Once the customer enters the token back into a site (along with their email),
     * ValidateEmailVerificationToken will validate the token.
     *
     * Notice that GetEmailVerificationToken requires both the email and password.
     */
    public static async Execute(): Promise<void> {
        const email: string = "test@ultracart.com";
        const password: string = "squirrel";

        try {
            // Create token request
            const tokenRequest: EmailVerifyTokenRequest = {
                email: email,
                password: password
            };

            // Get email verification token
            const tokenResponse: EmailVerifyTokenResponse = await customerApi.getEmailVerificationToken({tokenRequest});
            const token: string | undefined = tokenResponse.token;

            if (token == undefined) {
                console.error("Token not found.");
                return;
            }

            // TODO - email the token to the customer, have them enter it back into another page...
            // TODO - verify the token with the following call

            // Create verify request
            const verifyRequest: EmailVerifyTokenValidateRequest = {
                token: token
            };

            // Validate email verification token
            const verifyResponse: EmailVerifyTokenValidateResponse = await customerApi.validateEmailVerificationToken({validationRequest: verifyRequest});

            console.log("Was the correct token provided? " + verifyResponse.success);
        } catch (error) {
            console.error("An error occurred during email verification:", error);
        }
    }
}