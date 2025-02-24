import {customerApi} from '../api.js';

export class GetEmailVerificationToken {
    /*
        GetEmailVerificationToken and ValidateEmailVerificationToken are tandem functions that allow a merchant to verify
        a customer's email address. GetEmailVerificationToken returns back a token that the merchant can use however
        they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
        it back into a website. Once the customer enters the token back into a site (along with their email),
        ValidateEmailVerificationToken will validate the token.

        Notice that GetEmailVerificationToken requires both the email and password.
     */
    static async execute() {
        const email = "test@ultracart.com";
        const password = "squirrel";

        const tokenRequest = {
            email: email,
            password: password
        };

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

        // TODO - email the token to the customer, have them enter it back into another page...
        // TODO - verify the token with the following call

        const verifyRequest = {
            token: token
        };
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
    }
}