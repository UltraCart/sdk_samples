<?php

/**
 * Batch Coupon Code Generator
 * Generates large batches of coupon codes by calling the API repeatedly
 *
 * Usage: php coupon/generateCouponCodesBatch.php <merchant_code> [total_codes] [output_file]
 * Example: php coupon/generateCouponCodesBatch.php 10OFF 10000 codes.csv
 */

use ultracart\v2\api\CouponApi;
use ultracart\v2\models\CouponCodesRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';

// Parse command line arguments
$merchant_code = $argv[1] ?? null;
$total_codes = isset($argv[2]) ? intval($argv[2]) : 10000;
$output_file = $argv[3] ?? "coupon_codes_{$merchant_code}_" . time() . ".csv";

// Validate inputs
if (!$merchant_code) {
    fwrite(STDERR, "Error: Merchant code is required\n");
    fwrite(STDERR, "Usage: php coupon/generateCouponCodesBatch.php <merchant_code> [total_codes] [output_file]\n");
    fwrite(STDERR, "Example: php coupon/generateCouponCodesBatch.php 10OFF 10000 codes.csv\n");
    exit(1);
}

if ($total_codes < 1 || $total_codes > 100000) {
    fwrite(STDERR, "Error: total_codes must be between 1 and 100,000 (got {$total_codes})\n");
    exit(1);
}

// Display header
echo "Batch Coupon Code Generator\n";
echo "=============================\n";
echo "Merchant Code: {$merchant_code}\n";
echo "Total Codes: {$total_codes}\n";
echo "Output File: {$output_file}\n";
echo "\n";

// Initialize API client
$coupon_api = CouponApi::usingApiKey(Constants::API_KEY);

// Look up coupon by merchant code
echo "Looking up coupon by merchant code...\n";
try {
    $coupon_response = $coupon_api->getCouponByMerchantCode($merchant_code);
    $coupon_oid = $coupon_response->getCoupon()->getCouponOid();
    echo "Found coupon OID: {$coupon_oid}\n";
    echo "\n";
} catch (Exception $e) {
    fwrite(STDERR, "Error: Coupon with merchant code '{$merchant_code}' not found\n");
    fwrite(STDERR, "Details: " . $e->getMessage() . "\n");
    exit(1);
}

// Calculate batching
const BATCH_SIZE = 1000;
$num_batches = intval(ceil($total_codes / BATCH_SIZE));
$all_codes = [];

echo "Generating codes in batches of " . BATCH_SIZE . "...\n";
$start_time = microtime(true);

// Generate codes in batches
for ($batch_num = 1; $batch_num <= $num_batches; $batch_num++) {
    // Calculate batch size
    if ($batch_num == $num_batches) {
        $batch_size = $total_codes - ($batch_num - 1) * BATCH_SIZE;
    } else {
        $batch_size = BATCH_SIZE;
    }

    // Create request
    $codes_request = new CouponCodesRequest();
    $codes_request->setQuantity($batch_size);
    $codes_request->setExpirationDts(date('Y-m-d', strtotime('+365 days')) . "T00:00:00+00:00");

    // Call API with retry logic
    $retry_count = 0;
    $success = false;

    while ($retry_count < 2 && !$success) {
        try {
            $batch_response = $coupon_api->generateCouponCodes($coupon_oid, $codes_request);
            $batch_codes = $batch_response->getCouponCodes();
            $all_codes = array_merge($all_codes, $batch_codes);
            $success = true;

            // Display progress
            $elapsed = microtime(true) - $start_time;
            echo "[{$batch_num}/{$num_batches}] Generated {$batch_size} codes (Total: " . count($all_codes) . ") - Elapsed: " . number_format($elapsed, 1) . "s\n";
        } catch (Exception $e) {
            $retry_count++;
            if ($retry_count < 2) {
                echo "Warning: Batch {$batch_num} failed, retrying...\n";
                sleep(2); // exponential backoff
            } else {
                fwrite(STDERR, "Error: Failed to generate batch {$batch_num} after retries\n");
                fwrite(STDERR, "Details: " . $e->getMessage() . "\n");
                exit(1);
            }
        }
    }

    // Rate limiting - sleep between batches (except last)
    if ($batch_num < $num_batches) {
        usleep(750000); // 750ms in microseconds
    }
}

echo "\n";
echo "Writing codes to CSV file...\n";

// Write to CSV
try {
    $file_handle = fopen($output_file, 'w');
    if ($file_handle === false) {
        throw new Exception("Could not open file for writing");
    }

    // Write header
    fputcsv($file_handle, ['code', 'generated_at', 'batch_number']);

    // Write codes
    $batch_num = 1;
    $codes_in_batch = 0;
    $timestamp = gmdate('Y-m-d\TH:i:s\Z');

    foreach ($all_codes as $code) {
        fputcsv($file_handle, [$code, $timestamp, $batch_num]);

        $codes_in_batch++;
        if ($codes_in_batch >= BATCH_SIZE) {
            $batch_num++;
            $codes_in_batch = 0;
        }
    }

    fclose($file_handle);
    echo "Successfully saved " . count($all_codes) . " codes to: {$output_file}\n";
} catch (Exception $e) {
    fwrite(STDERR, "Error writing to file: " . $e->getMessage() . "\n");
    exit(1);
}

// Display summary
$total_time = microtime(true) - $start_time;
$avg_time = $total_time / $num_batches;

echo "\n";
echo "Summary:\n";
echo "- Merchant Code: {$merchant_code}\n";
echo "- Coupon OID: {$coupon_oid}\n";
echo "- Total Codes Generated: " . count($all_codes) . "\n";
echo "- Batches Processed: {$num_batches}\n";
echo "- Total Time: " . number_format($total_time, 1) . "s\n";
echo "- Average per batch: " . number_format($avg_time, 1) . "s\n";
echo "- Output File: " . realpath($output_file) . "\n";
