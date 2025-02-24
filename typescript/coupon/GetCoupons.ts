import { DateTime } from 'luxon';
import {Coupon, GetCouponsRequest} from 'ultracart_rest_api_v2_typescript';
import { couponApi } from '../api'; // Assuming this is how the API is imported

/**
 * Retrieves and processes coupons from UltraCart
 */
export class GetCoupons {
    /**
     * Executes the coupon retrieval process
     * @returns Promise resolving to an array of retrieved coupons
     */
    public static async execute(): Promise<Coupon[]> {
        console.log(`--- ${this.name} ---`);

        try {
            const coupons: Coupon[] = [];

            let iteration = 1;
            let offset = 0;
            const limit = 200;
            let needMoreRecords = true;

            while (needMoreRecords) {
                console.log(`executing iteration #${iteration++}`);
                const blockOfCoupons = await this.getCouponsChunk({ limit, offset });

                if(blockOfCoupons !== undefined && blockOfCoupons !== null) {
                    blockOfCoupons.forEach(coupon => {
                        coupons.push(coupon);
                    });

                    offset += limit;
                    needMoreRecords = blockOfCoupons.length === limit;
                } else {
                    needMoreRecords = false;
                }

                // Optional: rate limiting
                // await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Display the coupons
            coupons.forEach(coupon => {
                console.log(coupon);
            });

            console.log(`Total coupons retrieved: ${coupons.length}`);

            return coupons;
        }
        catch (ex: unknown) {
            const error = ex as Error;
            console.error(`Error: ${error.message}`);
            console.error(error.stack);
            throw ex; // Re-throw to allow caller to handle the error
        }
    }

    /**
     * Returns a block of coupons
     * @param params - Coupon retrieval parameters
     * @returns Promise resolving to a list of Coupon objects
     */
    public static async getCouponsChunk(params: GetCouponsRequest = {}): Promise<Coupon[]|undefined> {
        // Default parameters
        const defaultParams: GetCouponsRequest = {
            merchantCode: undefined,
            description: undefined,
            couponType: undefined,
            startDateBegin: undefined,
            startDateEnd: undefined,
            expirationDateBegin: undefined,
            expirationDateEnd: undefined,
            affiliateOid: undefined,
            excludeExpired: false,
            limit: 200,
            offset: 0,
            sort: undefined,
            expand: undefined
        };

        // Merge default params with provided params
        const mergedParams = { ...defaultParams, ...params };

        const getResponse = await couponApi.getCoupons(mergedParams);

        if (getResponse.success && getResponse.success) {
            return getResponse.coupons;
        }

        return [];
    }
}

// Example of how to call the method
// async function example() {
//     try {
//         // Retrieve all coupons
//         const coupons = await GetCoupons.execute();

//         // Retrieve coupons with specific parameters
//         const specificCoupons = await GetCoupons.getCouponsChunk({
//             merchantCode: 'MERCHANT123',
//             excludeExpired: true,
//             limit: 100
//         });
//     } catch (error) {
//         console.error('Failed to retrieve coupons', error);
//     }
// }