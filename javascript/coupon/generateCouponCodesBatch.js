import { couponApi } from '../api.js';
import { DateTime } from 'luxon';
import * as fs from 'fs';

/**
 * Batch Coupon Code Generator
 * Generates large batches of coupon codes by calling the API repeatedly
 *
 * Usage: NODE_TLS_REJECT_UNAUTHORIZED=0 node coupon/generateCouponCodesBatch.js <merchant_code> [total_codes] [output_file]
 * Example: NODE_TLS_REJECT_UNAUTHORIZED=0 node coupon/generateCouponCodesBatch.js 10OFF 10000 codes.csv
 */

export class GenerateCouponCodesBatch {
    static async execute() {
        // Parse command line arguments
        const merchantCode = process.argv[2];
        const totalCodes = parseInt(process.argv[3] || '10000');
        const outputFile = process.argv[4] || `coupon_codes_${merchantCode}_${Date.now()}.csv`;

        // Validate inputs
        if (!merchantCode) {
            console.error('Error: Merchant code is required');
            console.error('Usage: node coupon/generateCouponCodesBatch.js <merchant_code> [total_codes] [output_file]');
            console.error('Example: node coupon/generateCouponCodesBatch.js 10OFF 10000 codes.csv');
            process.exit(1);
        }

        if (totalCodes < 1 || totalCodes > 100000) {
            console.error(`Error: total_codes must be between 1 and 100,000 (got ${totalCodes})`);
            process.exit(1);
        }

        // Display header
        console.log('Batch Coupon Code Generator');
        console.log('=============================');
        console.log(`Merchant Code: ${merchantCode}`);
        console.log(`Total Codes: ${totalCodes}`);
        console.log(`Output File: ${outputFile}`);
        console.log('');

        try {
            // Look up coupon by merchant code
            console.log('Looking up coupon by merchant code...');
            const couponResponse = await new Promise((resolve, reject) => {
                couponApi.getCouponByMerchantCode(merchantCode, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });

            const couponOid = couponResponse.coupon.coupon_oid;
            console.log(`Found coupon OID: ${couponOid}`);
            console.log('');

            // Calculate batching
            const BATCH_SIZE = 1000;
            const numBatches = Math.ceil(totalCodes / BATCH_SIZE);
            const allCodes = [];

            console.log(`Generating codes in batches of ${BATCH_SIZE}...`);
            const startTime = Date.now();

            // Generate codes in batches
            for (let batchNum = 1; batchNum <= numBatches; batchNum++) {
                // Calculate batch size
                const batchSize = (batchNum === numBatches)
                    ? totalCodes - (batchNum - 1) * BATCH_SIZE
                    : BATCH_SIZE;

                // Create request
                const codesRequest = {
                    quantity: batchSize,
                    expiration_dts: DateTime.utc().plus({ days: 365 }).toISO()
                };

                // Call API with retry logic
                let retryCount = 0;
                let success = false;

                while (retryCount < 2 && !success) {
                    try {
                        const batchResponse = await new Promise((resolve, reject) => {
                            couponApi.generateCouponCodes(couponOid, codesRequest, function (error, data, response) {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(data);
                                }
                            });
                        });

                        const batchCodes = batchResponse.coupon_codes;
                        allCodes.push(...batchCodes);
                        success = true;

                        // Display progress
                        const elapsed = (Date.now() - startTime) / 1000;
                        console.log(`[${batchNum}/${numBatches}] Generated ${batchSize} codes (Total: ${allCodes.length}) - Elapsed: ${elapsed.toFixed(1)}s`);
                    } catch (error) {
                        retryCount++;
                        if (retryCount < 2) {
                            console.log(`Warning: Batch ${batchNum} failed, retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 2000)); // exponential backoff
                        } else {
                            console.error(`Error: Failed to generate batch ${batchNum} after retries`);
                            console.error(`Details: ${error.message}`);
                            process.exit(1);
                        }
                    }
                }

                // Rate limiting - sleep between batches (except last)
                if (batchNum < numBatches) {
                    await new Promise(resolve => setTimeout(resolve, 750));
                }
            }

            console.log('');
            console.log('Writing codes to CSV file...');

            // Write to CSV
            try {
                let csvContent = 'code,generated_at,batch_number\n';

                let batchNum = 1;
                let codesInBatch = 0;
                const timestamp = new Date().toISOString();

                for (const code of allCodes) {
                    csvContent += `${code},${timestamp},${batchNum}\n`;

                    codesInBatch++;
                    if (codesInBatch >= BATCH_SIZE) {
                        batchNum++;
                        codesInBatch = 0;
                    }
                }

                fs.writeFileSync(outputFile, csvContent, 'utf8');
                console.log(`Successfully saved ${allCodes.length} codes to: ${outputFile}`);
            } catch (error) {
                console.error(`Error writing to file: ${error.message}`);
                process.exit(1);
            }

            // Display summary
            const totalTime = (Date.now() - startTime) / 1000;
            const avgTime = totalTime / numBatches;

            console.log('');
            console.log('Summary:');
            console.log(`- Merchant Code: ${merchantCode}`);
            console.log(`- Coupon OID: ${couponOid}`);
            console.log(`- Total Codes Generated: ${allCodes.length}`);
            console.log(`- Batches Processed: ${numBatches}`);
            console.log(`- Total Time: ${totalTime.toFixed(1)}s`);
            console.log(`- Average per batch: ${avgTime.toFixed(1)}s`);
            console.log(`- Output File: ${fs.realpathSync(outputFile)}`);

        } catch (error) {
            if (error.message && error.message.includes('not found')) {
                console.error(`Error: Coupon with merchant code '${merchantCode}' not found`);
            } else {
                console.error(`Error: ${error.message}`);
            }
            if (error.status) {
                console.error(`Status: ${error.status}`);
            }
            process.exit(1);
        }
    }
}
