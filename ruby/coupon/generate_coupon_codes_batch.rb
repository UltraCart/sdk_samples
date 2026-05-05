require_relative '../constants'
require 'ultracart_api'
require 'csv'
require 'date'

# Batch Coupon Code Generator
# Generates large batches of coupon codes by calling the API repeatedly
# Usage: ruby generate_coupon_codes_batch.rb <merchant_code> [total_codes] [output_file]
# Example: ruby generate_coupon_codes_batch.rb 10OFF 10000 codes.csv

# Parse command line arguments
merchant_code = ARGV[0]
total_codes = (ARGV[1] || '10000').to_i
output_file = ARGV[2] || "coupon_codes_#{merchant_code}_#{Time.now.to_i}.csv"

# Validate inputs
if merchant_code.nil? || merchant_code.empty?
  puts 'Error: Merchant code is required'
  puts 'Usage: ruby generate_coupon_codes_batch.rb <merchant_code> [total_codes] [output_file]'
  puts 'Example: ruby generate_coupon_codes_batch.rb 10OFF 10000 codes.csv'
  exit 1
end

if total_codes < 1 || total_codes > 100000
  puts "Error: total_codes must be between 1 and 100,000 (got #{total_codes})"
  exit 1
end

# Display header
puts 'Batch Coupon Code Generator'
puts '============================='
puts "Merchant Code: #{merchant_code}"
puts "Total Codes: #{total_codes}"
puts "Output File: #{output_file}"
puts ''

# Initialize API client
coupon_api = UltracartClient::CouponApi.new_using_api_key(Constants::API_KEY)

# Look up coupon by merchant code
puts 'Looking up coupon by merchant code...'
begin
  coupon_response = coupon_api.get_coupon_by_merchant_code(merchant_code)
  coupon_oid = coupon_response.coupon.coupon_oid
  puts "Found coupon OID: #{coupon_oid}"
  puts ''
rescue UltracartClient::ApiError => e
  puts "Error: Coupon with merchant code '#{merchant_code}' not found"
  puts "Details: #{e.message}"
  puts "Status code: #{e.code}" if e.respond_to?(:code)
  exit 1
end

# Calculate batching
BATCH_SIZE = 1000
num_batches = (total_codes.to_f / BATCH_SIZE).ceil
all_codes = []

puts "Generating codes in batches of #{BATCH_SIZE}..."
start_time = Time.now

# Generate codes in batches
(1..num_batches).each do |batch_num|
  # Calculate batch size
  batch_size = if batch_num == num_batches
                 total_codes - (batch_num - 1) * BATCH_SIZE
               else
                 BATCH_SIZE
               end

  # Create request
  codes_request = UltracartClient::CouponCodesRequest.new
  codes_request.quantity = batch_size
  codes_request.expiration_dts = (Date.today + 365).strftime('%Y-%m-%d') + 'T00:00:00+00:00'

  # Call API with retry logic
  retry_count = 0
  success = false

  while retry_count < 2 && !success
    begin
      batch_response = coupon_api.generate_coupon_codes(coupon_oid, codes_request)
      batch_codes = batch_response.coupon_codes
      all_codes.concat(batch_codes)
      success = true

      # Display progress
      elapsed = Time.now - start_time
      puts "[#{batch_num}/#{num_batches}] Generated #{batch_size} codes (Total: #{all_codes.length}) - Elapsed: #{elapsed.round(1)}s"
    rescue UltracartClient::ApiError => e
      retry_count += 1
      if retry_count < 2
        puts "Warning: Batch #{batch_num} failed, retrying..."
        sleep(2) # exponential backoff
      else
        puts "Error: Failed to generate batch #{batch_num} after retries"
        puts "Details: #{e.message}"
        exit 1
      end
    end
  end

  # Rate limiting - sleep between batches (except last)
  sleep(0.75) if batch_num < num_batches
end

puts ''
puts 'Writing codes to CSV file...'

# Write to CSV
begin
  CSV.open(output_file, 'w') do |csv|
    # Write header
    csv << ['code', 'generated_at', 'batch_number']

    # Write codes
    batch_num = 1
    codes_in_batch = 0
    timestamp = Time.now.utc.strftime('%Y-%m-%dT%H:%M:%SZ')

    all_codes.each do |code|
      csv << [code, timestamp, batch_num]

      codes_in_batch += 1
      if codes_in_batch >= BATCH_SIZE
        batch_num += 1
        codes_in_batch = 0
      end
    end
  end

  puts "Successfully saved #{all_codes.length} codes to: #{output_file}"
rescue StandardError => e
  puts "Error writing to file: #{e.message}"
  exit 1
end

# Display summary
total_time = Time.now - start_time
avg_time = total_time / num_batches

puts ''
puts 'Summary:'
puts "- Merchant Code: #{merchant_code}"
puts "- Coupon OID: #{coupon_oid}"
puts "- Total Codes Generated: #{all_codes.length}"
puts "- Batches Processed: #{num_batches}"
puts "- Total Time: #{total_time.round(1)}s"
puts "- Average per batch: #{avg_time.round(1)}s"
puts "- Output File: #{File.absolute_path(output_file)}"
