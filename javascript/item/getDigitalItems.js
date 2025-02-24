import {itemApi} from '../api.js';
import {ItemFunctions} from './itemFunctions.js'; // Assuming ItemFunctions is in a separate file

export class GetDigitalItems {
    static async execute() {
        try {
            /*
             * Please Note!
             * Digital Items are not normal items you sell on your site. They are digital files that you may add to
             * a library and then attach to a normal item as an accessory or the main item itself.
             * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
             */

            const digitalItemOid = await ItemFunctions.insertSampleDigitalItem(); // create an item so I can get an item

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
                itemApi.getDigitalItems(request, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const digitalItems = apiResponse.digital_items; // assuming this succeeded

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