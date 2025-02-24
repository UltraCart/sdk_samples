import { customerApi } from '../api.js';

export class GetCustomersByQuery {
    /*
     * This example illustrates how to retrieve customers. It uses the pagination logic necessary to query all customers.
     */
    static async execute() {
        // pulling all records could take a long time.
        const customers = [];

        let iteration = 1;
        let offset = 0;
        const limit = 200;
        let moreRecordsToFetch = true;

        try {
            while (moreRecordsToFetch) {
                console.log("executing iteration " + iteration);

                const chunkOfCustomers = await GetCustomersByQuery.getCustomerChunk(offset, limit);
                customers.push(...chunkOfCustomers);
                offset = offset + limit;
                moreRecordsToFetch = chunkOfCustomers.length === limit;
                iteration++;
            }
        } catch (e) {
            console.log("Exception occurred on iteration " + iteration);
            console.log(e);
            process.exit(1);
        }

        // this will be verbose...
        for (const customer of customers) {
            console.log(customer);
        }
    }

    /**
     * Retrieves a chunk of customers based on specified parameters
     * @param offset Starting position for retrieval
     * @param limit Maximum number of records to retrieve
     * @returns Array of customers
     */
    static async getCustomerChunk(offset, limit) {
        // The real devil in the getCustomers calls is the expansion, making sure you return everything you need without
        // returning everything since these objects are extremely large. The customer object can be truly large with
        // all the order history. These are the possible expansion values.
        /*
            attachments     billing     cards           cc_emails       loyalty     orders_summary          pricing_tiers
            privacy         properties  quotes_summary  reviewer        shipping    software_entitlements   tags
            tax_codes
        */
        const expand = "shipping,billing"; // just the address fields. contact us if you're unsure

        // TODO: This is just showing all the possibilities. In reality, you'll just assign the filters you need.
        const query = {
            //email: undefined,
            //qbClass: undefined,
            //quickbooksCode: undefined,
            //lastModifiedDtsStart: undefined,
            //lastModifiedDtsEnd: undefined,
            //signupDtsStart: undefined,
            //signupDtsEnd: undefined,
            //billingFirstName: undefined,
            //billingLastName: undefined,
            //billingCompany: undefined,
            //billingCity: undefined,
            //billingState: undefined,
            //billingPostalCode: undefined,
            //billingCountryCode: undefined,
            //billingDayPhone: undefined,
            //billingEveningPhone: undefined,
            //shippingFirstName: undefined,
            //shippingLastName: undefined,
            //shippingCompany: undefined,
            //shippingCity: undefined,
            //shippingState: undefined,
            //shippingPostalCode: undefined,
            //shippingCountryCode: undefined,
            //shippingDayPhone: undefined,
            //shippingEveningPhone: undefined,
            //pricingTierOid: undefined,
            //pricingTierName: undefined
        };

        const opts = {
            _offset: offset,
            _limit: limit,
            _since: undefined,
            _sort: "email",
            _expand: expand
        };

        const apiResponse = await new Promise((resolve, reject) => {
            customerApi.getCustomersByQuery(query, opts, function(error, data, response) {
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
}