import {Customer, CustomerResponse} from 'ultracart_rest_api_v2_typescript';
import {customerApi} from '../api';
import {CustomerFunctions} from './CustomerFunctions';


export class UpdateCustomer {
    /**
     * Executes a customer update workflow
     * Inserts a sample customer, updates their billing address,
     * and then deletes the sample customer
     */
    public static async Execute(): Promise<void> {
        try {
            // Insert a sample customer and get their OID
            const customerOid: number = await CustomerFunctions.insertSampleCustomer();

            // just want address fields. see https://www.ultracart.com/api/#resource_customer.html for all expansion values
            const expand: string = "billing,shipping";

            // Retrieve the customer
            const customerResponse = await customerApi.getCustomer({customerProfileOid: customerOid, expand});
            const customer: Customer | undefined = customerResponse.customer;

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
            const apiResponse: CustomerResponse = await customerApi.updateCustomer({
                customerProfileOid: customerOid,
                customer: customer,
                expand: expand
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