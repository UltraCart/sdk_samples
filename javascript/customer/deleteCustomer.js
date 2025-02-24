import {CustomerFunctions} from './customerFunctions.js';

export class DeleteCustomer {
    static async execute() {
        try {
            const customerOid = await CustomerFunctions.insertSampleCustomer();
            await CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ex) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(ex); // <-- change_me: handle gracefully
            process.exit(1);
        }
    }
}