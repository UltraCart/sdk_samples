import { DateTime } from 'luxon';
import { couponApi } from '../api.js'; // Added .js extension

/**
 * Retrieves and processes coupons from UltraCart
 */
export class GetCoupons {
    /**
     * Executes the coupon retrieval process
     * @returns Promise resolving to an array of retrieved coupons
     */
    static async execute() {
        console.log(`--- ${this.name} ---`);

        try {
            const coupons = [];

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
        catch (ex) {
            const error = ex;
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
    static async getCouponsChunk(params = {}) {
        // Default parameters
        const defaultParams = {
            merchantCode: undefined,
            description: undefined,
            couponType: undefined,
            startDateBegin: undefined,
            startDateEnd: undefined,
            expirationDateBegin: undefined,
            expirationDateEnd: undefined,
            affiliateOid: undefined,
            excludeExpired: false,
            _limit: 200,
            _offset: 0,
            _sort: undefined,
            _expand: undefined
        };

        // Merge default params with provided params
        const mergedParams = { ...defaultParams, ...params };

        const getResponse = await new Promise((resolve, reject) => {
            couponApi.getCoupons(mergedParams, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });

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