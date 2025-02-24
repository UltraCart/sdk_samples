import {customerApi} from '../api.js';

export class GetCustomers {
    /**
     * This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
     * This method was the first GetCustomers and has parameters for all the search terms. It's an ogre. Using
     * GetCustomersByQuery is much easier to use.
     */
    static async getCustomerChunk(offset, limit) {
        // The real devil in the GetCustomers calls is the expansion, making sure you return everything you need without
        // returning everything since these objects are extremely large. The customer object can be truly large with
        // all the order history. These are the possible expansion values.
        /*
            attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
            privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
            tax_codes
         */
        const expand = "shipping,billing"; // just the address fields. contact us if you're unsure

        // TODO: Seriously, use GetCustomersByQuery -- it's so much better than this old method.
        const params = {
            email: undefined,
            qbClass: undefined,
            quickbooksCode: undefined,
            lastModifiedDtsStart: undefined,
            lastModifiedDtsEnd: undefined,
            signupDtsStart: undefined,
            signupDtsEnd: undefined,
            billingFirstName: undefined,
            billingLastName: undefined,
            billingCompany: undefined,
            billingCity: undefined,
            billingState: undefined,
            billingPostalCode: undefined,
            billingCountryCode: undefined,
            billingDayPhone: undefined,
            billingEveningPhone: undefined,
            shippingFirstName: undefined,
            shippingLastName: undefined,
            shippingCompany: undefined,
            shippingCity: undefined,
            shippingState: undefined,
            shippingPostalCode: undefined,
            shippingCountryCode: undefined,
            shippingDayPhone: undefined,
            shippingEveningPhone: undefined,
            pricingTierOid: undefined,
            pricingTierName: undefined,
            _limit: limit,
            _offset: offset,
            _since: undefined,
            _sort: undefined,
            _expand: expand
        };

        const apiResponse = await new Promise((resolve, reject) => {
            customerApi.getCustomers(params, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

        if (apiResponse.customers) {
            return apiResponse.customers;
        }
        return [];
    }

    static async execute() {
        try {
            const customers = [];

            let iteration = 1;
            let offset = 0;
            const limit = 200;
            let moreRecordsToFetch = true;

            while (moreRecordsToFetch) {
                console.log(`Executing iteration ${iteration}`);

                const chunkOfCustomers = await GetCustomers.getCustomerChunk(offset, limit);
                customers.push(...chunkOfCustomers);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfCustomers.length === limit;
                iteration++;
            }

            // This will be verbose...
            console.log(customers);
        } catch (ex) {
            console.error(`Exception occurred: ${ex.message}`);
            console.error(ex);
            process.exit(1);
        }
    }
}