package coupon;

import com.ultracart.admin.v2.CouponApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Batch Coupon Code Generator
 * Generates large batches of coupon codes by calling the API repeatedly
 *
 * Usage: java -cp target/sdk_samples-1.0-SNAPSHOT.jar coupon.GenerateCouponCodesBatch <merchant_code> [total_codes] [output_file]
 * Example: java -cp target/sdk_samples-1.0-SNAPSHOT.jar coupon.GenerateCouponCodesBatch 10OFF 10000 codes.csv
 */
public class GenerateCouponCodesBatch {
    private static final int BATCH_SIZE = 1000;

    public static void execute(String[] args) {
        // Parse command line arguments
        if (args.length < 1) {
            System.err.println("Error: Merchant code is required");
            System.err.println("Usage: java -cp target/sdk_samples-1.0-SNAPSHOT.jar coupon.GenerateCouponCodesBatch <merchant_code> [total_codes] [output_file]");
            System.err.println("Example: java -cp target/sdk_samples-1.0-SNAPSHOT.jar coupon.GenerateCouponCodesBatch 10OFF 10000 codes.csv");
            System.exit(1);
        }

        String merchantCode = args[0];
        int totalCodes = args.length > 1 ? Integer.parseInt(args[1]) : 10000;
        String outputFile = args.length > 2 ? args[2] :
            "coupon_codes_" + merchantCode + "_" + System.currentTimeMillis() + ".csv";

        // Validate inputs
        if (totalCodes < 1 || totalCodes > 100000) {
            System.err.println("Error: total_codes must be between 1 and 100,000 (got " + totalCodes + ")");
            System.exit(1);
        }

        // Display header
        System.out.println("Batch Coupon Code Generator");
        System.out.println("=============================");
        System.out.println("Merchant Code: " + merchantCode);
        System.out.println("Total Codes: " + totalCodes);
        System.out.println("Output File: " + outputFile);
        System.out.println();

        try {
            // Initialize API client
            CouponApi couponApi = new CouponApi(Constants.API_KEY);

            // Look up coupon by merchant code
            System.out.println("Looking up coupon by merchant code...");
            CouponResponse couponResponse = couponApi.getCouponByMerchantCode(merchantCode, null);
            Integer couponOid = couponResponse.getCoupon().getCouponOid();
            System.out.println("Found coupon OID: " + couponOid);
            System.out.println();

            // Calculate batching
            int numBatches = (int) Math.ceil((double) totalCodes / BATCH_SIZE);
            List<String> allCodes = new ArrayList<>();

            System.out.println("Generating codes in batches of " + BATCH_SIZE + "...");
            long startTime = System.currentTimeMillis();

            // Generate codes in batches
            for (int batchNum = 1; batchNum <= numBatches; batchNum++) {
                // Calculate batch size
                int batchSize = (batchNum == numBatches)
                    ? totalCodes - (batchNum - 1) * BATCH_SIZE
                    : BATCH_SIZE;

                // Create request
                CouponCodesRequest codesRequest = new CouponCodesRequest();
                codesRequest.setQuantity(batchSize);
                codesRequest.setExpirationDts(Instant.now().plus(365, ChronoUnit.DAYS).toString());

                // Call API with retry logic
                int retryCount = 0;
                boolean success = false;

                while (retryCount < 2 && !success) {
                    try {
                        CouponCodesResponse batchResponse = couponApi.generateCouponCodes(couponOid, codesRequest);
                        List<String> batchCodes = batchResponse.getCouponCodes();
                        allCodes.addAll(batchCodes);
                        success = true;

                        // Display progress
                        double elapsed = (System.currentTimeMillis() - startTime) / 1000.0;
                        System.out.printf("[%d/%d] Generated %d codes (Total: %d) - Elapsed: %.1fs%n",
                            batchNum, numBatches, batchSize, allCodes.size(), elapsed);
                    } catch (ApiException e) {
                        retryCount++;
                        if (retryCount < 2) {
                            System.out.println("Warning: Batch " + batchNum + " failed, retrying...");
                            Thread.sleep(2000); // exponential backoff
                        } else {
                            System.err.println("Error: Failed to generate batch " + batchNum + " after retries");
                            System.err.println("Details: " + e.getMessage());
                            System.exit(1);
                        }
                    }
                }

                // Rate limiting - sleep between batches (except last)
                if (batchNum < numBatches) {
                    Thread.sleep(750);
                }
            }

            System.out.println();
            System.out.println("Writing codes to CSV file...");

            // Write to CSV
            try (FileWriter writer = new FileWriter(outputFile)) {
                // Write header
                writer.write("code,generated_at,batch_number\n");

                // Write codes
                int batchNum = 1;
                int codesInBatch = 0;
                String timestamp = Instant.now().toString();

                for (String code : allCodes) {
                    writer.write(code + "," + timestamp + "," + batchNum + "\n");

                    codesInBatch++;
                    if (codesInBatch >= BATCH_SIZE) {
                        batchNum++;
                        codesInBatch = 0;
                    }
                }

                System.out.println("Successfully saved " + allCodes.size() + " codes to: " + outputFile);
            } catch (IOException e) {
                System.err.println("Error writing to file: " + e.getMessage());
                System.exit(1);
            }

            // Display summary
            double totalTime = (System.currentTimeMillis() - startTime) / 1000.0;
            double avgTime = totalTime / numBatches;

            System.out.println();
            System.out.println("Summary:");
            System.out.println("- Merchant Code: " + merchantCode);
            System.out.println("- Coupon OID: " + couponOid);
            System.out.println("- Total Codes Generated: " + allCodes.size());
            System.out.println("- Batches Processed: " + numBatches);
            System.out.printf("- Total Time: %.1fs%n", totalTime);
            System.out.printf("- Average per batch: %.1fs%n", avgTime);
            System.out.println("- Output File: " + Paths.get(outputFile).toAbsolutePath());

        } catch (ApiException e) {
            System.err.println("Error: Coupon with merchant code '" + merchantCode + "' not found");
            System.err.println("Details: " + e.getMessage());
            System.err.println("Status code: " + e.getCode());
            System.exit(1);
        } catch (InterruptedException e) {
            System.err.println("Error: Thread interrupted");
            System.err.println("Details: " + e.getMessage());
            System.exit(1);
        }
    }

    public static void main(String[] args) {
        execute(args);
    }
}
