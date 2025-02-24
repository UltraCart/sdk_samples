import {customerApi} from '../api.js';

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
    static async Execute() {
        const email = "test@ultracart.com";
        const password = "squirrel";

        try {
            // Create token request
            const tokenRequest = {
                email: email,
                password: password
            };

            // Get email verification token
            const tokenResponse = await new Promise((resolve, reject) => {
                customerApi.getEmailVerificationToken(tokenRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const token = tokenResponse.token;

            if (token == undefined) {
                console.error("Token not found.");
                return;
            }

            // TODO - email the token to the customer, have them enter it back into another page...
            // TODO - verify the token with the following call

            // Create verify request
            const verifyRequest = {
                token: token
            };

            // Validate email verification token
            const verifyResponse = await new Promise((resolve, reject) => {
                customerApi.validateEmailVerificationToken(verifyRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            console.log("Was the correct token provided? " + verifyResponse.success);
        } catch (error) {
            console.error("An error occurred during email verification:", error);
        }
    }
}