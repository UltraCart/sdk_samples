import { itemApi } from '../api.js';
import { ItemFunctions } from './itemFunctions.js'; // Assuming ItemFunctions is in a separate file

export class GetDigitalItem {
    static async execute() {
        try {
            /*
             * Please Note!
             * Digital Items are not normal items you sell on your site. They are digital files that you may add to
             * a library and then attach to a normal item as an accessory or the main item itself.
             * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1376485/Digital+Items
             */

            const digitalItemOid = await ItemFunctions.insertSampleDigitalItem(); // create an item so I can get an item
            const apiResponse = await new Promise((resolve, reject) => {
                itemApi.getDigitalItem(digitalItemOid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const digitalItem = apiResponse.digital_item; // assuming this succeeded

            console.log("The following item was retrieved via GetDigitalItem():");
            console.log(digitalItem);

            await ItemFunctions.deleteSampleDigitalItem(digitalItemOid);
        } catch (e) {
            console.log("An Exception occurred. Please review the following error:");
            console.log(e); // <-- change_me: handle gracefully
            throw e; // Equivalent to Environment.Exit(1), but better for async context
        }
    }
}