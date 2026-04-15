using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.coupon
{
    /// <summary>
    /// Batch Coupon Code Generator
    /// Generates large batches of coupon codes by calling the API repeatedly
    ///
    /// Usage: bin/Debug/SdkSample.exe GenerateCouponCodesBatch <merchant_code> [total_codes] [output_file]
    /// Example: bin/Debug/SdkSample.exe GenerateCouponCodesBatch 10OFF 10000 codes.csv
    /// </summary>
    public class GenerateCouponCodesBatch
    {
        private const int BATCH_SIZE = 1000;

        public static void Execute(string[] args)
        {
            // Parse command line arguments
            if (args.Length < 1)
            {
                Console.Error.WriteLine("Error: Merchant code is required");
                Console.Error.WriteLine("Usage: bin/Debug/SdkSample.exe GenerateCouponCodesBatch <merchant_code> [total_codes] [output_file]");
                Console.Error.WriteLine("Example: bin/Debug/SdkSample.exe GenerateCouponCodesBatch 10OFF 10000 codes.csv");
                Environment.Exit(1);
            }

            string merchantCode = args[0];
            int totalCodes = args.Length > 1 ? int.Parse(args[1]) : 10000;
            string outputFile = args.Length > 2 ? args[2] :
                $"coupon_codes_{merchantCode}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}.csv";

            // Validate inputs
            if (totalCodes < 1 || totalCodes > 100000)
            {
                Console.Error.WriteLine($"Error: total_codes must be between 1 and 100,000 (got {totalCodes})");
                Environment.Exit(1);
            }

            // Display header
            Console.WriteLine("Batch Coupon Code Generator");
            Console.WriteLine("=============================");
            Console.WriteLine($"Merchant Code: {merchantCode}");
            Console.WriteLine($"Total Codes: {totalCodes}");
            Console.WriteLine($"Output File: {outputFile}");
            Console.WriteLine();

            try
            {
                // Initialize API client
                CouponApi couponApi = new CouponApi(Constants.ApiKey);

                // Look up coupon by merchant code
                Console.WriteLine("Looking up coupon by merchant code...");
                CouponResponse couponResponse = couponApi.GetCouponByMerchantCode(merchantCode);
                int? couponOid = couponResponse.Coupon.CouponOid;
                Console.WriteLine($"Found coupon OID: {couponOid}");
                Console.WriteLine();

                // Calculate batching
                int numBatches = (int)Math.Ceiling((double)totalCodes / BATCH_SIZE);
                List<string> allCodes = new List<string>();

                Console.WriteLine($"Generating codes in batches of {BATCH_SIZE}...");
                DateTime startTime = DateTime.Now;

                // Generate codes in batches
                for (int batchNum = 1; batchNum <= numBatches; batchNum++)
                {
                    // Calculate batch size
                    int batchSize = (batchNum == numBatches)
                        ? totalCodes - (batchNum - 1) * BATCH_SIZE
                        : BATCH_SIZE;

                    // Create request
                    CouponCodesRequest codesRequest = new CouponCodesRequest();
                    codesRequest.Quantity = batchSize;
                    codesRequest.ExpirationDts = DateTime.UtcNow.AddDays(365).ToString("yyyy-MM-ddTHH:mm:ssK");

                    // Call API with retry logic
                    int retryCount = 0;
                    bool success = false;

                    while (retryCount < 2 && !success)
                    {
                        try
                        {
                            CouponCodesResponse batchResponse = couponApi.GenerateCouponCodes(couponOid, codesRequest);
                            List<string> batchCodes = batchResponse.CouponCodes;
                            allCodes.AddRange(batchCodes);
                            success = true;

                            // Display progress
                            double elapsed = (DateTime.Now - startTime).TotalSeconds;
                            Console.WriteLine($"[{batchNum}/{numBatches}] Generated {batchSize} codes (Total: {allCodes.Count}) - Elapsed: {elapsed:F1}s");
                        }
                        catch (Exception e)
                        {
                            retryCount++;
                            if (retryCount < 2)
                            {
                                Console.WriteLine($"Warning: Batch {batchNum} failed, retrying...");
                                Thread.Sleep(2000); // exponential backoff
                            }
                            else
                            {
                                Console.Error.WriteLine($"Error: Failed to generate batch {batchNum} after retries");
                                Console.Error.WriteLine($"Details: {e.Message}");
                                Environment.Exit(1);
                            }
                        }
                    }

                    // Rate limiting - sleep between batches (except last)
                    if (batchNum < numBatches)
                    {
                        Thread.Sleep(750);
                    }
                }

                Console.WriteLine();
                Console.WriteLine("Writing codes to CSV file...");

                // Write to CSV
                try
                {
                    using (StreamWriter writer = new StreamWriter(outputFile))
                    {
                        // Write header
                        writer.WriteLine("code,generated_at,batch_number");

                        // Write codes
                        int batchNum = 1;
                        int codesInBatch = 0;
                        string timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssK");

                        foreach (string code in allCodes)
                        {
                            writer.WriteLine($"{code},{timestamp},{batchNum}");

                            codesInBatch++;
                            if (codesInBatch >= BATCH_SIZE)
                            {
                                batchNum++;
                                codesInBatch = 0;
                            }
                        }
                    }

                    Console.WriteLine($"Successfully saved {allCodes.Count} codes to: {outputFile}");
                }
                catch (Exception e)
                {
                    Console.Error.WriteLine($"Error writing to file: {e.Message}");
                    Environment.Exit(1);
                }

                // Display summary
                double totalTime = (DateTime.Now - startTime).TotalSeconds;
                double avgTime = totalTime / numBatches;

                Console.WriteLine();
                Console.WriteLine("Summary:");
                Console.WriteLine($"- Merchant Code: {merchantCode}");
                Console.WriteLine($"- Coupon OID: {couponOid}");
                Console.WriteLine($"- Total Codes Generated: {allCodes.Count}");
                Console.WriteLine($"- Batches Processed: {numBatches}");
                Console.WriteLine($"- Total Time: {totalTime:F1}s");
                Console.WriteLine($"- Average per batch: {avgTime:F1}s");
                Console.WriteLine($"- Output File: {Path.GetFullPath(outputFile)}");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: Coupon with merchant code '{merchantCode}' not found");
                Console.Error.WriteLine($"Details: {ex.Message}");
                Environment.Exit(1);
            }
        }
    }
}
