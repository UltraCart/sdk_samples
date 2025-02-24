import {itemApi} from '../api.js';

export class GetInventorySnapshot {
    /**
     * Retrieve a list of item inventories.
     * Note: This method may be called once every 15 minutes.
     * More frequent calls will result in a 429 response.
     */
    static async execute() {
        try {
            // Retrieve inventory snapshot
            const snapshotResponse = await new Promise((resolve, reject) => {
                itemApi.getInventorySnapshot(function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // Iterate and log each inventory item
            snapshotResponse.inventories?.forEach((inventory) => {
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