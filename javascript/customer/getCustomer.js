import { customerApi } from '../api.js';
import { CustomerFunctions } from './customerFunctions.js';

export class GetCustomer {
    /**
     * Of the two GetCustomer methods, you'll probably always use GetCustomerByEmail instead of this one.
     * Most customer logic revolves around the email, not the customer oid. The latter is only meaningful as a primary
     * key in the UltraCart databases. But here is an example of using GetCustomer().
     */
    static async execute() {
        try {
            const email = CustomerFunctions.createRandomEmail();
            const customerOid = await CustomerFunctions.insertSampleCustomer(email);

            // the expand variable is set to return just the address fields.
            // see CustomerFunctions for a list of expansions, or consult the source: https://www.ultracart.com/api/
            const apiResponse = await new Promise((resolve, reject) => {
                customerApi.getCustomer(customerOid,{_expand: 'billing,shipping'}, function(error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const customer = apiResponse.customer; // assuming this succeeded

            console.log(customer);

            await CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ex) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(ex); // <-- change_me: handle gracefully
            process.exit(1);
        }
    }
}