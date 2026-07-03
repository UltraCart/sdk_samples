# frozen_string_literal: true

# Bulk upsert customers -- end-to-end lifecycle with operation="upsert".
#
# "upsert" creates a customer when none is found and otherwise replaces the
# existing one (a full-record replace, identical to PUT /rest/v2/customer -- a
# field you omit is cleared, it is not a partial merge). Upsert is customer-only
# in v1; submitting operation="upsert" to /rest/v2/bulk/order is a 400.
#
# Identity resolution per line:
#   1. The _merchant_record_id marker from a prior landing wins (that customer is updated).
#   2. No marker -> resolve by the line's email; still no match -> insert.
# On success each record reports action="inserted" or action="updated".
#
# See bulk_import_orders.rb for the fully-commented base flow; this sample
# highlights only what differs for upsert.

require 'json'
require 'net/http'
require 'uri'
require 'ultracart_api'
require_relative '../constants'

OBJECT_TYPE = 'customer'

api = UltracartClient::BulkApi.new_using_api_key(Constants::API_KEY, Constants::VERIFY_SSL, Constants::DEBUG_MODE)

# Each line is what the per-record customer-create endpoint accepts, plus the
# top-level _merchant_record_id. When email is your natural key, using it as the
# _merchant_record_id makes the bulk dedupe and UC's email-uniqueness agree.
# These are plain Ruby hashes (raw NDJSON), not UltracartClient::Customer models.
customers = [
  {
    _merchant_record_id: 'jane@example.com',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Doe',
    billing: [{
      first_name: 'Jane', last_name: 'Doe', address1: '123 Main St',
      city: 'Austin', state_region: 'TX', postal_code: '78701', country_code: 'US', default_billing: true
    }],
    tags: ['legacy-import']
  },
  {
    _merchant_record_id: 'john@example.com',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Smith'
  }
]

ndjson = customers.map(&:to_json).join("\n")

TERMINAL = %w[succeeded partial_success failed cancelled].freeze
POLL_TRIES = 20
POLL_SLEEP = 3 # seconds

begin
  upload_url_response = api.bulk_generate_upload_url(OBJECT_TYPE)
  upload_url = upload_url_response.upload_url
  s3_key = upload_url_response.s3_key
  puts "Upload URL issued (s3_key=#{s3_key})."

  # Raw HTTP PUT to the presigned S3 URL -- does NOT go through the SDK.
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

  puts "Uploaded #{customers.length} customers."

  # The only submit difference vs. insert: operation = "upsert".
  request = UltracartClient::BulkJobRequest.new
  request.s3_key = s3_key
  request.operation = 'upsert'

  submit_response = api.bulk_submit_job(OBJECT_TYPE, request)
  job = submit_response.bulk_job
  job_id = job.job_id
  puts "Submitted upsert job #{job_id} (operation=#{job.operation})."

  tries = 0
  while !TERMINAL.include?(job.status) && tries < POLL_TRIES
    sleep POLL_SLEEP
    job = api.bulk_get_job(OBJECT_TYPE, job_id).bulk_job
    puts "  status=#{job.status} processed=#{job.processed_records || 0}/#{job.total_records || '?'}"
    tries += 1
  end

  puts "\nJob #{job_id} finished: #{job.status}"
  puts "  success=#{job.success_count} failed=#{job.fail_count} duplicate=#{job.duplicate_count}"

  # On upsert, each successful record tells you whether it created or replaced a
  # customer via the "action" field (inserted | updated).
  puts "\nPer-record actions:"
  cursor = nil
  loop do
    opts = { status: 'success', limit: 100 }
    opts[:cursor] = cursor if cursor
    records_response = api.bulk_get_job_records(OBJECT_TYPE, job_id, opts)
    records_response.records.each do |record|
      puts "  [#{record.merchant_record_id}] #{record.action} -> uc_id=#{record.uc_id}"
    end
    cursor = records_response.next_cursor
    break unless cursor
  end

  if job.fail_count.to_i.positive?
    puts "\nFailed records (an email_conflict means the line's email belongs to a different customer than the marker resolved to):"
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
  puts "Bulk upsert failed: #{e.response_body || e.message}"
end
