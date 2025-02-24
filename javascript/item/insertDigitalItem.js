import { ItemFunctions } from './itemFunctions.js';

/**
 * Execute method containing all business logic
 */
export async function execute() {
    try {
        const digitalItemOid = await ItemFunctions.insertSampleDigitalItem();
        await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // <-- change_me: handle gracefully
        process.exit(1);
    }
}