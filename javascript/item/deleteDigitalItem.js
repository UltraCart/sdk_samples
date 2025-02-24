import {ItemFunctions} from './itemFunctions.js';

export class DeleteDigitalItem {
    static async execute() {
        try {
            const digitalItemOid = await ItemFunctions.insertSampleDigitalItem();
            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (e) {
            console.log("An Exception occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }
    }
}