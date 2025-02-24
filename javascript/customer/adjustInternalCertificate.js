import {customerApi} from '../api.js';
import {DateTime} from 'luxon';

export class AdjustInternalCertificate {
    /**
     * Adjusts the cashback balance of a customer. This method's name is adjustInternalCertificate, which
     * is a poor choice of naming, but results from an underlying implementation of using an internal gift certificate
     * to track cashback balance. Sorry for the confusion.
     *
     * This method requires a customer profile oid. This is a unique number used by UltraCart to identify a customer.
     * If you do not know a customer's oid, call getCustomerByEmail() to retrieve the customer and their oid.
     *
     * Possible Errors:
     * Missing adjustment amount -> "adjust_internal_certificate_request.adjustment_amount is required and was missing"
     */
    static async execute() {
        const email = "test@ultracart.com";

        // Retrieve customer by email
        const customerResponse = await new Promise((resolve, reject) => {
            customerApi.getCustomerByEmail(email, function(error, data, response) {
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

        const adjustRequest = {
            description: "Adjusting customer cashback balance because they called and complained about product.",
            expiration_days: 365, // expires in 365 days
            vesting_days: 45, // customer has to wait 45 days to use it.
            adjustment_amount: 59, // add 59 to their balance.
            order_id: "DEMO-12345", // or leave undefined. this ties the adjustment to a particular order.
            entry_dts: DateTime.now().setZone('America/New_York').toISO() // use current time in ISO format
        };

        const apiResponse = await new Promise((resolve, reject) => {
            customerApi.adjustInternalCertificate(customerOid,adjustRequest, function(error, data, response) {
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
            throw new Error("Failed to adjust internal certificate");
        }

        console.log(`Success: ${apiResponse.success}`);
        console.log(`Adjustment Amount: ${apiResponse.adjustment_amount}`);
        console.log(`Balance Amount: ${apiResponse.balance_amount}`);

        console.log(apiResponse);
    }
}