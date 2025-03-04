import { ItemFunctions } from './itemFunctions.js';

/**
 * Execute method containing all business logic
 */
export async function execute() {
    try {
        const itemId = await ItemFunctions.insertSampleItem();
        await ItemFunctions.deleteSampleItem(itemId);
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // handle gracefully
        process.exit(1);
    }
}