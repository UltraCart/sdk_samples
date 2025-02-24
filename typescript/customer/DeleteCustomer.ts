import {CustomerFunctions} from './CustomerFunctions';

export class DeleteCustomer {
    public static async execute(): Promise<void> {
        try {
            const customerOid: number = await CustomerFunctions.insertSampleCustomer();
            await CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (ex) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(ex); // <-- change_me: handle gracefully
            process.exit(1);
        }
    }
}