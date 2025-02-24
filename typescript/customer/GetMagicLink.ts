import {customerApi} from '../api';
import {CustomerMagicLinkResponse} from 'ultracart_rest_api_v2_typescript';
import {CustomerFunctions} from './CustomerFunctions';

export class GetMagicLink {
    /**
     * getMagicLink returns back a url whereby a merchant can log into their website as the customer.
     * This may be useful to "see what the customer is seeing" and is the only method to do so since
     * the customer's passwords are encrypted.  Note: A merchant may also do this using the UltraCart
     * backend site within the Customer Management section.
     */
    public static async execute(): Promise<void> {
        try {
            // create a customer
            const customerOid: number = await CustomerFunctions.insertSampleCustomer();
            const storefront: string = "www.website.com";  // required.  many merchants have dozens of storefronts. which one?

            const apiResponse: CustomerMagicLinkResponse = await customerApi.getMagicLink({
                customerProfileOid: customerOid,
                storefrontHostName: storefront
            });
            const url: string = apiResponse.url || "error_failed_to_get_magic_link";

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