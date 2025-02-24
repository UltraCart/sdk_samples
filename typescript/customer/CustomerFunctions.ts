import {customerApi} from '../api';
import {
    Customer,
    CustomerResponse
} from 'ultracart_rest_api_v2_typescript';

/**
 * Utility functions for customer-related operations
 */
export class CustomerFunctions {
    /**
     * Creates a random email for test purposes
     * @returns A random email address
     */
    public static createRandomEmail(): string {
        const chars = "ABCDEFGH";
        const stringChars: string[] = [];

        for (let i = 0; i < chars.length; i++) {
            stringChars.push(chars[Math.floor(Math.random() * chars.length)]);
        }

        const rand = stringChars.join('');
        return `sample_${rand}.test.com`;
    }

    /**
     * Inserts a sample customer into the system
     * @param email Optional email address. If undefined, a random one will be generated
     * @returns The new created customer's customerProfileOid
     */
    public static async insertSampleCustomer(email?: string): Promise<number> {
        const chars = "ABCDEFGH";
        const stringChars: string[] = [];

        for (let i = 0; i < chars.length; i++) {
            stringChars.push(chars[Math.floor(Math.random() * chars.length)]);
        }

        const rand = stringChars.join('');

        if (!email) {
            email = `sample_${rand}.test.com`;
        }

        console.log(`InsertSampleCustomer will attempt to create customer ${email}`);

        const newCustomer: Customer = {
            email: email,
            billing: [{
                first_name: `First${rand}`,
                last_name: `Last${rand}`,
                company: `Company${rand}`,
                country_code: "US",
                state_region: "GA",
                city: "Duluth",
                postal_code: "30097",
                address1: "11960 Johns Creek Parkway"
            }],
            shipping: [{
                first_name: `First${rand}`,
                last_name: `Last${rand}`,
                company: `Company${rand}`,
                country_code: "US",
                state_region: "GA",
                city: "Duluth",
                postal_code: "30097",
                address1: "11960 Johns Creek Parkway"
            }]
        };

        // Expansion variables to retrieve additional customer details
        const expand = "billing,shipping";

        /* Possible Expansion variables:
           attachments
           billing
           cards
           cc_emails
           loyalty
           orders_summary
           pricing_tiers
           privacy
           properties
           quotes_summary
           reviewer
           shipping
           software_entitlements
           tags
           tax_codes
        */

        console.log("InsertCustomer request object follows:");
        console.log(newCustomer);

        const apiResponse: CustomerResponse = await customerApi.insertCustomer({customer: newCustomer, expand});

        console.log("InsertCustomer response object follows:");
        console.log(apiResponse);

        // Ensure we have a customer and its profile oid before returning
        if (apiResponse.customer?.customer_profile_oid === undefined) {
            throw new Error("Failed to create customer: No customer profile OID returned");
        }

        return apiResponse.customer.customer_profile_oid;
    }

    /**
     * If you don't know the customer oid, call GetCustomerByEmail first to retrieve
     * the customer, grab the oid, and use it.
     * @param customerOid Customer oid of the customer to be deleted
     */
    public static async deleteSampleCustomer(customerOid: number): Promise<void> {
        console.log(`calling DeleteCustomer(${customerOid})`);
        await customerApi.deleteCustomer({customerProfileOid: customerOid});
    }
}