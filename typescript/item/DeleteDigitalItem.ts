import {ItemFunctions} from './ItemFunctions'; // Assuming ItemFunctions is in a separate file

export class DeleteDigitalItem {
    public static async execute(): Promise<void> {
        try {
            const digitalItemOid: number = await ItemFunctions.insertSampleDigitalItem();
            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (e) {
            console.log("An Exception occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }
    }
}