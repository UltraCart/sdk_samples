import { itemApi } from '../api';
import {
    ItemInventorySnapshotResponse,
    ItemInventorySnapshot
} from 'ultracart_rest_api_v2_typescript';

export class GetInventorySnapshot {
    /**
     * Retrieve a list of item inventories.
     * Note: This method may be called once every 15 minutes.
     * More frequent calls will result in a 429 response.
     */
    public static async execute(): Promise<void> {
        try {
            // Retrieve inventory snapshot
            const snapshotResponse: ItemInventorySnapshotResponse = await itemApi.getInventorySnapshot();

            // Iterate and log each inventory item
            snapshotResponse.inventories?.forEach((inventory: ItemInventorySnapshot) => {
                console.log(JSON.stringify(inventory, null, 2));
            });
        } catch (error) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(error);
            process.exit(1);
        }
    }
}

// Optional: If you want to execute the method
// GetInventorySnapshot.execute().catch(console.error);