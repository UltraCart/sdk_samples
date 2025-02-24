import {itemApi} from '../api';
import {ItemDigitalItem, ItemDigitalItemsResponse} from 'ultracart_rest_api_v2_typescript';
import {ItemFunctions} from './ItemFunctions'; // Assuming ItemFunctions is in a separate file

export class GetDigitalItems {
    public static async execute(): Promise<void> {
        try {
            /*
             * Please Note!
             * Digital Items are not normal items you sell on your site. They are digital files that you may add to
             * a library and then attach to a normal item as an accessory or the main item itself.
             * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
             */

            const digitalItemOid: number = await ItemFunctions.insertSampleDigitalItem(); // create an item so I can get an item

            const limit = 100;
            const offset = 0;
            const since: string | undefined = undefined; // digital items do not use since. leave as undefined.
            const sort: string | undefined = undefined; // if undefined, use default of original_filename
            const expand: string | undefined = undefined; // digital items have no expansion. leave as undefined. this value is ignored
            const placeholders: boolean | undefined = undefined; // digital items have no placeholders. leave as undefined.

            const apiResponse: ItemDigitalItemsResponse = await itemApi.getDigitalItems({
                limit,
                offset,
                since,
                sort,
                expand: expand,
                placeholders
            });
            const digitalItems: ItemDigitalItem[] | undefined = apiResponse.digital_items; // assuming this succeeded

            if (digitalItems === undefined) {
                console.error("Could not find digital items from the list");
            } else {
                console.log("The following items were retrieved via GetDigitalItems():");
                for (const digitalItem of digitalItems) {
                    console.log(digitalItem);
                }
            }
        } catch (e) {
            console.log("An Exception occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }
    }
}