import {customerApi} from '../api';
import {CustomerMergeRequest} from 'ultracart_rest_api_v2_typescript';
import {CustomerFunctions} from './CustomerFunctions';

export class MergeCustomer {
    /**
     * The merge function was requested by UltraCart merchants that sell software and manage activation keys.  Frequently,
     * customers would purchase their software using one email address, and then accidentally re-subscribe using a
     * different email address (for example, they purchased subsequent years using PayPal which was tied to their spouse's
     * email).  However it happened, the customer now how software licenses spread across multiple emails and therefore
     * multiple customer profiles.
     *
     * merge combine the customer profiles, merging order history and software entitlements.  Still, it may be used to
     * combine any two customer profiles for any reason.
     *
     * Success returns back a status code 204 (No Content)
     */
    public static async execute(): Promise<void> {
        try {
            // first customer
            const firstCustomerOid: number = await CustomerFunctions.insertSampleCustomer();

            const secondEmail: string = CustomerFunctions.createRandomEmail();
            const secondCustomerOid: number = await CustomerFunctions.insertSampleCustomer(secondEmail);

            const mergeRequest: CustomerMergeRequest = {
                // Supply either the email or the customer oid.  Only need one.
                email: secondEmail,
                // customerProfileOid: customerOid, // Commented out as in original code
            };

            await customerApi.mergeCustomer({customerProfileOid: firstCustomerOid, customer: mergeRequest});

            // clean up this sample.
            await CustomerFunctions.deleteSampleCustomer(firstCustomerOid);
            // Notice: No need to delete the second sample.  The merge call deletes it.
        } catch (e) {
            console.error("An ApiException occurred. Please review the following error:");
            console.error(e); // <-- change_me: handle gracefully
            throw e;
        }
    }
}