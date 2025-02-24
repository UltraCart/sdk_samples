import {customerApi} from '../api.js';

export class AddCustomerStoreCredit {
    /**
     * Adds store credit to a customer's account.
     *
     * This method requires a customer profile oid. This is a unique number used by UltraCart to identify a customer.
     * If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
     *
     * Possible Errors:
     * Missing store credit -> "store_credit_request.amount is missing and is required."
     * Zero or negative store credit -> "store_credit_request.amount must be a positive amount."
     */
    static async execute() {
        const email = "test@ultracart.com";

        // Retrieve customer by email
        const customerResponse = await new Promise((resolve, reject) => {
            customerApi.getCustomerByEmail(email, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        const customer = customerResponse.customer;

        if (!customer || !customer.customer_profile_oid) {
            throw new Error("Customer not found or missing customer profile OID");
        }

        const customerOid = customer.customer_profile_oid;

        const storeCreditRequest = {
            amount: 20.00,
            description: "Customer is super cool and I wanted to give them store credit.",
            expiration_days: 365, // or leave undefined for no expiration
            vesting_days: 45 // customer has to wait 45 days to use it.
        };

        const apiResponse = await new Promise((resolve, reject) => {
            customerApi.addCustomerStoreCredit(customerOid, storeCreditRequest, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        if (apiResponse.error) {
            console.error(apiResponse.error.developer_message);
            console.error(apiResponse.error.user_message);
            throw new Error("Failed to add store credit");
        }

        console.log(apiResponse.success);
    }
}