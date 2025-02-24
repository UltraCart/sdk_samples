import { itemApi } from '../api';
import {
    ItemDigitalItemsResponse,
    ItemDigitalItem
} from 'ultracart_rest_api_v2_typescript';
import { ItemFunctions } from './ItemFunctions';

/**
 * Execute method containing all business logic
 */
export async function execute(): Promise<void> {
    try {
        /*
         * Please Note!
         * Digital Items are not normal items you sell on your site. They are digital files that you may add to
         * a library and then attach to a normal item as an accessory or the main item itself.
         * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
         *
         * Retrieves a group of digital items (file information) from the account that are not yet associated with any
         * actual items. If no parameters are specified, all digital items will be returned. Be aware that these are
         * not normal items that can be added to a shopping cart. Rather, they are digital files that may be associated
         * with normal items. You will need to make multiple API calls in order to retrieve the entire result set since
         * this API performs result set pagination.
         *
         * Default sort order: original_filename
         * Possible sort orders: original_filename, description, file_size
         */

        const digitalItemOid: number = await ItemFunctions.insertSampleDigitalItem(); // create an item that will be unassociated.

        const limit: number = 100;
        const offset: number = 0;
        const since: string | undefined = undefined; // digital items do not use since. leave as undefined.
        const sort: string | undefined = undefined; // if undefined, use default of original_filename
        const expand: string | undefined = undefined; // digital items have no expansion. leave as undefined. this value is ignored
        const placeholders: boolean | undefined = undefined; // digital items have no placeholders. leave as undefined.

        const apiResponse: ItemDigitalItemsResponse = await itemApi.getUnassociatedDigitalItems({
            limit,
            offset,
            since,
            sort,
            expand,
            placeholders
        });

        const digitalItems: ItemDigitalItem[] = apiResponse.digital_items || [];

        console.log("The following items were retrieved via getUnassociatedDigitalItems():");
        digitalItems.forEach((digitalItem: ItemDigitalItem) => {
            console.log(digitalItem.toString());
        });
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // <-- change_me: handle gracefully
        process.exit(1);
    }
}