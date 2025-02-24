import {CustomerFunctions} from './CustomerFunctions';

export class InsertCustomer {
    public static async execute(): Promise<void> {
        const customerOid: number = await CustomerFunctions.insertSampleCustomer();
        await CustomerFunctions.deleteSampleCustomer(customerOid);
    }
}