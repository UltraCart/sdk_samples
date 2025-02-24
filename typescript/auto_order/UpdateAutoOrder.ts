import {autoOrderApi} from '../api';
import {
    AutoOrder
} from 'ultracart_rest_api_v2_typescript';

export class UpdateAutoOrder {
    /*
     *
     * This method allows for updating an auto order.
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
            const expand = "items,items.future_schedules,original_order,rebill_orders"; // see https://www.ultracart.com/api/#resource_auto_order.html for list
            const autoOrderOid: number = 123456789; // get an auto order and update it. There are many ways to retrieve an auto order.
            const apiResponse = await autoOrderApi.getAutoOrder({autoOrderOid, expand: expand});
            const autoOrderOrUndefined = apiResponse.auto_order;
            const validateOriginalOrder = "No";

            if (autoOrderOrUndefined !== undefined) {
                const autoOrder = autoOrderOrUndefined as AutoOrder;

                // for this example, the customer supplied the wrong postal code when ordering. So to change the postal code for
                // all subsequent auto orders, we change the original order.
                if (autoOrder?.original_order && autoOrder.original_order.billing) {
                    autoOrder.original_order.billing.postal_code = "44233";
                }

                const updateResponse = await autoOrderApi.updateAutoOrder({
                    autoOrderOid,
                    autoOrder,
                    validateOriginalOrder,
                    expand
                });

                const updatedAutoOrder = updateResponse.auto_order;
                console.log(updatedAutoOrder);
            }
        } catch (ex) {
            console.error(`Error: ${ex instanceof Error ? ex.message : 'Unknown error'}`);
            console.error(ex instanceof Error ? ex.stack : ex);
        }
    }
}

// Example of how to call the method
// UpdateAutoOrder.execute().catch(console.error);