import {customerApi} from '../api.js';
import {CustomerFunctions} from './customerFunctions.js';

export class GetMagicLink {
    /**
     * getMagicLink returns back a url whereby a merchant can log into their website as the customer.
     * This may be useful to "see what the customer is seeing" and is the only method to do so since
     * the customer's passwords are encrypted.  Note: A merchant may also do this using the UltraCart
     * backend site within the Customer Management section.
     */
    static async execute() {
        try {
            // create a customer
            const customerOid = await CustomerFunctions.insertSampleCustomer();
            const storefront = "www.website.com";  // required.  many merchants have dozens of storefronts. which one?

            const apiResponse = await new Promise((resolve, reject) => {
                customerApi.getMagicLink(customerOid, storefront, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const url = apiResponse.url || "error_failed_to_get_magic_link";

            // Note: In a web context, you'd typically use window.location or a framework-specific routing method
            document.write(`<html><body><script>window.location.href = "${encodeURIComponent(url)}";</script></body></html>`);

            // clean up this sample. - don't do this or the above magic link won't work.  But you'll want to clean up this
            // sample customer manually using the backend.
            // await CustomerFunctions.deleteSampleCustomer(customerOid);
        } catch (e) {
            console.error("An ApiException occurred. Please review the following error:");
            console.error(e); // handle gracefully
            throw e; // or handle as appropriate in your application
        }
    }
}