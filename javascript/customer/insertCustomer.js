import { CustomerFunctions } from './customerFunctions.js';

export class InsertCustomer {
    static async execute() {
        const customerOid = await CustomerFunctions.insertSampleCustomer();
        await CustomerFunctions.deleteSampleCustomer(customerOid);
    }
}