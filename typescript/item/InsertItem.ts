import { ItemFunctions } from './ItemFunctions';

/**
 * Execute method containing all business logic
 */
export async function execute(): Promise<void> {
    try {
        const itemId: string = await ItemFunctions.insertSampleItem();
        await ItemFunctions.deleteSampleItem(itemId);
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // handle gracefully
        process.exit(1);
    }
}