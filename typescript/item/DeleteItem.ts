import {ItemFunctions} from './ItemFunctions'; // Assuming ItemFunctions is in a separate file

export class DeleteItem {
    public static async execute(): Promise<void> {
        try {
            const itemOid: number = await ItemFunctions.insertSampleItemAndGetOid();
            await ItemFunctions.deleteSampleItemByOid(itemOid);
        } catch (e) {
            console.log("An Exception occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }
    }
}