import { itemApi } from '../api.js';
import { ItemFunctions } from './itemFunctions.js';

/**
 * Execute method containing all business logic
 */
export async function execute() {
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

        const digitalItemOid = await ItemFunctions.insertSampleDigitalItem(); // create an item that will be unassociated.

        const limit = 100;
        const offset = 0;
        const since = undefined; // digital items do not use since. leave as undefined.
        const sort = undefined; // if undefined, use default of original_filename
        const expand = undefined; // digital items have no expansion. leave as undefined. this value is ignored
        const placeholders = undefined; // digital items have no placeholders. leave as undefined.

        const request = {
            _limit: limit,
            _offset: offset,
            _since: since,
            _sort: sort,
            _expand: expand,
            _placeholders: placeholders
        };
        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.getUnassociatedDigitalItems(request, function (error, data, response) {
                if (error) reject(error);
                else resolve(data, response);
            });
        });

        const digitalItems = apiResponse.digital_items || [];

        console.log("The following items were retrieved via getUnassociatedDigitalItems():");
        digitalItems.forEach((digitalItem) => {
            console.log(digitalItem ? digitalItem.toString() : undefined); // Handle toString() in JS
        });
    } catch (error) {
        console.error("An Exception occurred. Please review the following error:");
        console.error(error); // <-- change_me: handle gracefully
        process.exit(1);
    }
}