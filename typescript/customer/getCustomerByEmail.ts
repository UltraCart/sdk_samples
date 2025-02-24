import {customerApi} from '../api';
import {Customer, CustomerResponse} from 'ultracart_rest_api_v2_typescript';
import {CustomerFunctions} from './CustomerFunctions';

export class GetCustomerByEmail {
    /**
     * Of the two GetCustomer methods, you'll probably always use this one over GetCustomer.
     * Most customer logic revolves around the email, not the customer oid. The latter is only meaningful as a primary
     * key in the UltraCart databases. But our sample functions return back the oid, so we'll ignore that and just
     * use the email that we create.
     */
    public static async execute(): Promise<void> {
        try {
            const email: string = CustomerFunctions.createRandomEmail();
            const customerOid: number = await CustomerFunctions.insertSampleCustomer(email);

            // the expand variable is set to return just the address fields.
            // see CustomerFunctions for a list of expansions, or consult the source: https://www.ultracart.com/api/
            const apiResponse: CustomerResponse = await customerApi.getCustomerByEmail({
                email: email,
                expand: 'billing,shipping'
            });
            const customer: Customer | undefined = apiResponse.customer; // assuming this succeeded

            console.log(customer);

            await CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ex) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(ex); // <-- change_me: handle gracefully
            process.exit(1);
        }
    }
}