import {customerApi} from '../api.js';
import {CustomerFunctions} from './customerFunctions.js';

export class UpdateCustomer {
    /**
     * Executes a customer update workflow
     * Inserts a sample customer, updates their billing address,
     * and then deletes the sample customer
     */
    static async Execute() {
        try {
            // Insert a sample customer and get their OID
            const customerOid = await CustomerFunctions.insertSampleCustomer();

            // just want address fields. see https://www.ultracart.com/api/#resource_customer.html for all expansion values
            const expand = "billing,shipping";

            // Retrieve the customer
            const customerResponse = await new Promise((resolve, reject) => {
                customerApi.getCustomer(customerOid, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const customer = customerResponse.customer;

            if (customer === undefined) {
                console.error("getCustomer returned undefined, cannot update.");
                process.exit(1);
            }

            // TODO: do some edits to the customer. Here we will change some billing fields.
            if (customer.billing && customer.billing.length > 0) {
                customer.billing[0].address2 = "Apartment 101";
            }

            // notice expand is passed to update as well since it returns back an updated customer object.
            // we use the same expansion, so we get back the same fields and can do comparisons.
            const apiResponse = await new Promise((resolve, reject) => {
                customerApi.updateCustomer(customerOid, customer, {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // verify the update
            console.log(apiResponse.customer);

            // Delete the sample customer
            await CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (e) {
            console.error("An unexpected error occurred:", e);
            process.exit(1);
        }
    }
}