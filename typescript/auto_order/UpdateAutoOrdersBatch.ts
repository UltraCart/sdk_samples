import {autoOrderApi} from '../api';
import {
    AutoOrder,
    AutoOrdersRequest
} from 'ultracart_rest_api_v2_typescript';

export class UpdateAutoOrdersBatch {
    /*
     *
     * This method allows for updating multiple auto orders.
     * Warning: Take great care editing auto orders.  They are complex.
     * Sometimes you must change the original_order to affect the auto_order.  If you have questions about what fields
     * to update to achieve your desired change, contact UltraCart support.  Better to ask and get it right than to
     * make a bad assumption and corrupt a thousand auto orders.  UltraCart support is ready to assist.
     *
     */
    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        try {
            // Create auto order API instance using API key

            // The _async parameter is what it seems.  True if async.
            // The max records allowed depends on the async flag.  Synch max is 20, Asynch max is 100.

            const async = true; // if true, success returns back a 204 No Content. False returns back the updated orders.
            const expand = undefined; // since we're async, nothing is returned, so we don't care about expansions.
            // If you are doing a synchronous operation, then set your expand appropriately. set getAutoOrders()
            // sample for expansion samples.
            const placeholders = false; // mostly used for UI, not needed for a pure scripting operation.

            const autoOrders: AutoOrder[] = []; // TODO: This should be a list of auto orders that have been updated. See any getAutoOrders method for retrieval.
            const autoOrdersRequest: AutoOrdersRequest = {
                autoOrders
            };

            const apiResponse = await autoOrderApi.updateAutoOrdersBatch({
                autoOrdersRequest,
                expand,
                placeholders,
                async
            });

            if (apiResponse) {
                // something went wrong if we have a response.
                console.log(apiResponse);
            }
        } catch (ex) {
            console.error(`Error: ${ex instanceof Error ? ex.message : 'Unknown error'}`);
            console.error(ex instanceof Error ? ex.stack : ex);
        }
    }
}

// Example of how to call the method
// UpdateAutoOrdersBatch.execute().catch(console.error);