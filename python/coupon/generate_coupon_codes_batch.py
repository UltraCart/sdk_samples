from ultracart.apis import CouponApi
from ultracart.models import CouponCodesRequest
import ultracart.rest
from samples import api_client
from datetime import datetime, timedelta
import sys
import csv
import time
import os
import math

# Batch Coupon Code Generator
# Generates large batches of coupon codes by calling the API repeatedly
# Usage: PYTHONPATH=. python coupon/generate_coupon_codes_batch.py <merchant_code> [total_codes] [output_file]
# Example: PYTHONPATH=. python coupon/generate_coupon_codes_batch.py 10OFF 10000 codes.csv

# Parse command line arguments
merchant_code = sys.argv[1] if len(sys.argv) > 1 else None
total_codes = int(sys.argv[2]) if len(sys.argv) > 2 else 10000
output_file = sys.argv[3] if len(sys.argv) > 3 else f"coupon_codes_{merchant_code}_{int(time.time())}.csv"

# Validate inputs
if not merchant_code:
    print('Error: Merchant code is required')
    print('Usage: PYTHONPATH=. python coupon/generate_coupon_codes_batch.py <merchant_code> [total_codes] [output_file]')
    print('Example: PYTHONPATH=. python coupon/generate_coupon_codes_batch.py 10OFF 10000 codes.csv')
    sys.exit(1)

if total_codes < 1 or total_codes > 100000:
    print(f'Error: total_codes must be between 1 and 100,000 (got {total_codes})')
    sys.exit(1)

# Display header
print('Batch Coupon Code Generator')
print('=============================')
print(f'Merchant Code: {merchant_code}')
print(f'Total Codes: {total_codes}')
print(f'Output File: {output_file}')
print('')

# Initialize API client
coupon_api = CouponApi(api_client())

# Look up coupon by merchant code
print('Looking up coupon by merchant code...')
try:
    coupon_response = coupon_api.get_coupon_by_merchant_code(merchant_code)
    coupon_oid = coupon_response.coupon.coupon_oid
    print(f'Found coupon OID: {coupon_oid}')
    print('')
except ultracart.rest.ApiException as e:
    print(f"Error: Coupon with merchant code '{merchant_code}' not found")
    print(f'Details: {e}')
    if hasattr(e, 'status'):
        print(f'Status: {e.status}')
    sys.exit(1)

# Calculate batching
BATCH_SIZE = 1000
num_batches = math.ceil(total_codes / BATCH_SIZE)
all_codes = []

print(f'Generating codes in batches of {BATCH_SIZE}...')
start_time = time.time()

# Generate codes in batches
for batch_num in range(1, num_batches + 1):
    # Calculate batch size
    if batch_num == num_batches:
        batch_size = total_codes - (batch_num - 1) * BATCH_SIZE
    else:
        batch_size = BATCH_SIZE

    # Create request
    codes_request = CouponCodesRequest()
    codes_request.quantity = batch_size
    expiration_date = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%dT%H:%M:%S+00:00')
    codes_request.expiration_dts = expiration_date

    # Call API with retry logic
    retry_count = 0
    success = False

    while retry_count < 2 and not success:
        try:
            batch_response = coupon_api.generate_coupon_codes(coupon_oid, codes_request)
            batch_codes = batch_response.coupon_codes
            all_codes.extend(batch_codes)
            success = True

            # Display progress
            elapsed = time.time() - start_time
            print(f'[{batch_num}/{num_batches}] Generated {batch_size} codes (Total: {len(all_codes)}) - Elapsed: {elapsed:.1f}s')
        except ultracart.rest.ApiException as e:
            retry_count += 1
            if retry_count < 2:
                print(f'Warning: Batch {batch_num} failed, retrying...')
                time.sleep(2)  # exponential backoff
            else:
                print(f'Error: Failed to generate batch {batch_num} after retries')
                print(f'Details: {e}')
                sys.exit(1)

    # Rate limiting - sleep between batches (except last)
    if batch_num < num_batches:
        time.sleep(0.75)

print('')
print('Writing codes to CSV file...')

# Write to CSV
try:
    with open(output_file, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)

        # Write header
        csv_writer.writerow(['code', 'generated_at', 'batch_number'])

        # Write codes
        batch_num = 1
        codes_in_batch = 0
        timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

        for code in all_codes:
            csv_writer.writerow([code, timestamp, batch_num])

            codes_in_batch += 1
            if codes_in_batch >= BATCH_SIZE:
                batch_num += 1
                codes_in_batch = 0

    print(f'Successfully saved {len(all_codes)} codes to: {output_file}')
except Exception as e:
    print(f'Error writing to file: {e}')
    sys.exit(1)

# Display summary
total_time = time.time() - start_time
avg_time = total_time / num_batches

print('')
print('Summary:')
print(f'- Merchant Code: {merchant_code}')
print(f'- Coupon OID: {coupon_oid}')
print(f'- Total Codes Generated: {len(all_codes)}')
print(f'- Batches Processed: {num_batches}')
print(f'- Total Time: {total_time:.1f}s')
print(f'- Average per batch: {avg_time:.1f}s')
print(f'- Output File: {os.path.abspath(output_file)}')
