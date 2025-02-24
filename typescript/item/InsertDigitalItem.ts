import { ItemFunctions } from './ItemFunctions';

/**
 * Execute method containing all business logic
 */
export async function execute(): Promise<void> {
    try {
        const digitalItemOid: number = await ItemFunctions.insertSampleDigitalItem();
        await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // <-- change_me: handle gracefully
        process.exit(1);
    }
}