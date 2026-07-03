# frozen_string_literal: true

# Bulk import orders -- end-to-end lifecycle.
#
# The bulk API is a throughput multiplier for the per-record REST endpoints: you
# upload an NDJSON file of records, submit one job, then poll it to completion.
#
# Flow demonstrated here:
#   1. Build an NDJSON payload (one order per line, each with a stable _merchant_record_id).
#   2. Ask the Bulk API for a presigned S3 upload URL.
#   3. PUT the NDJSON bytes straight to that URL (this step does NOT go through the SDK).
#   4. Submit the job. Orders are insert-only; operation defaults to "insert".
#   5. Poll the job until it reaches a terminal status.
#   6. Print the counts and list any failed records.
#
# For create-or-update semantics, see bulk_upsert_customers.rb (customer upsert).

require 'json'
require 'net/http'
require 'uri'
require 'ultracart_api'
require_relative '../constants'

OBJECT_TYPE = 'order'

api = UltracartClient::BulkApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

# --- 1. Build the NDJSON payload -------------------------------------------
# Each line is exactly what POST /rest/v2/order accepts, PLUS a top-level
# _merchant_record_id -- the bulk-surface dedupe key. Use a STABLE value derived
# from your source system (e.g. the legacy order id), NOT a fresh UUID, so that
# re-running a fixed file collapses to the original landing instead of re-inserting.
#
# NOTE: these are plain Ruby hashes, not SDK model instances. _merchant_record_id
# is not an SDK model field, and the worker parses each line as raw JSON, so we
# build the lines by hand rather than through UltracartClient::Order.
orders = [
  {
    _merchant_record_id: 'legacy-order-1029384',
    merchant_order_id: 'ORD-1029384',
    creation_dts: '2023-11-14T09:22:00Z',
    currency_code: 'USD',
    total: 79.50,
    customer_profile: { email: 'jane@example.com' },
    items: [
      { merchant_item_id: 'WIDGET-RED', quantity: 2, unit_cost: { currency_code: 'USD', value: 35.00 } }
    ],
    shipping: {
      ship_to: {
        first_name: 'Jane', last_name: 'Doe', address1: '123 Main St',
        city: 'Austin', state_region: 'TX', postal_code: '78701', country_code: 'US'
      },
      shipping_method: 'Standard'
    }
  },
  {
    _merchant_record_id: 'legacy-order-1029385',
    merchant_order_id: 'ORD-1029385',
    creation_dts: '2023-11-15T14:03:00Z',
    currency_code: 'USD',
    total: 35.00,
    customer_profile: { email: 'john@example.com' },
    items: [
      { merchant_item_id: 'WIDGET-BLUE', quantity: 1, unit_cost: { currency_code: 'USD', value: 35.00 } }
    ]
  }
]

# NDJSON = one minified JSON object per line, LF-separated. Do NOT wrap the records
# in a JSON array and do NOT pretty-print -- the worker parses the file line by line.
ndjson = orders.map(&:to_json).join("\n")

# Terminal job statuses -- poll stops once the job reaches one of these.
TERMINAL = %w[succeeded partial_success failed cancelled].freeze
POLL_TRIES = 20
POLL_SLEEP = 3 # seconds

begin
  # --- 2. Get a presigned upload URL --------------------------------------
  upload_url_response = api.bulk_generate_upload_url(OBJECT_TYPE)
  upload_url = upload_url_response.upload_url
  s3_key = upload_url_response.s3_key
  puts "Upload URL issued (s3_key=#{s3_key}, max_records=#{upload_url_response.max_records})."

  # --- 3. Upload the NDJSON straight to the presigned URL ------------------
  # A plain HTTP PUT to S3 -- this does NOT go through the SDK. The presigned URL
  # already carries its auth in the query string, so we send only the body.
  uri = URI(upload_url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = (uri.scheme == 'https')
  put = Net::HTTP::Put.new(uri)
  put['Content-Type'] = 'application/x-ndjson'
  put.body = ndjson
  put_response = http.request(put)
  unless put_response.is_a?(Net::HTTPSuccess)
    raise "Upload PUT failed: #{put_response.code} #{put_response.message}"
  end

  puts "Uploaded #{orders.length} records (#{ndjson.bytesize} bytes)."

  # --- 4. Submit the job --------------------------------------------------
  request = UltracartClient::BulkJobRequest.new
  request.s3_key = s3_key
  request.operation = 'insert' # default for orders; shown here for clarity
  # request.webhook_url = 'https://example.com/hooks/bulk' # optional one-shot completion POST

  submit_response = api.bulk_submit_job(OBJECT_TYPE, request)
  job = submit_response.bulk_job
  job_id = job.job_id
  puts "Submitted job #{job_id} (status=#{job.status})."

  # --- 5. Poll until terminal ---------------------------------------------
  # Bulk endpoints sit behind their own rate-limit bucket, so polling does not
  # consume your normal REST budget -- but still poll politely and bound the loop
  # so a stuck job can't hang the sample forever.
  tries = 0
  while !TERMINAL.include?(job.status) && tries < POLL_TRIES
    sleep POLL_SLEEP
    job = api.bulk_get_job(OBJECT_TYPE, job_id).bulk_job
    puts "  status=#{job.status} processed=#{job.processed_records || 0}/#{job.total_records || '?'}"
    tries += 1
  end

  # --- 6. Report ----------------------------------------------------------
  puts "\nJob #{job_id} finished: #{job.status}"
  puts "  success=#{job.success_count} failed=#{job.fail_count} duplicate=#{job.duplicate_count}"

  if job.fail_count.to_i.positive?
    puts "\nFailed records:"
    cursor = nil
    loop do
      opts = { status: 'failed', limit: 100 }
      opts[:cursor] = cursor if cursor
      records_response = api.bulk_get_job_records(OBJECT_TYPE, job_id, opts)
      records_response.records.each do |record|
        puts "  line #{record.line_number} [#{record.merchant_record_id}] #{record.error_code}: #{record.error_message}"
      end
      cursor = records_response.next_cursor
      break unless cursor
    end
  end
rescue UltracartClient::ApiError => e
  # SDK errors carry the HTTP response body, which holds the server-side detail.
  puts "Bulk import failed: #{e.response_body || e.message}"
end
