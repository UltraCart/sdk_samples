require 'ultracart_api'
require_relative '../constants'

# This example illustrates how to retrieve webhook log summaries.

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

def get_summary_chunk(webhook_api, offset, limit)
  webhook_oid = 123456789 # if you don't know this, use getWebhooks to find your webhook, then get its oid.
  _since = (Date.today - 10).strftime('%Y-%m-%d') + "T00:00:00+00:00" # get the last 10 days
  # Pay attention to whether limit or offset comes first in the method signature.  UltraCart is not consistent with their ordering.
  api_response = webhook_api.get_webhook_log_summaries(webhook_oid, limit, offset, _since)

  return api_response.webhook_log_summaries if api_response.webhook_log_summaries
  []
end

summaries = []

iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

begin
  while more_records_to_fetch
    puts "executing iteration #{iteration}"

    chunk_of_summaries = get_summary_chunk(webhook_api, offset, limit)
    summaries.concat(chunk_of_summaries)
    offset = offset + limit
    more_records_to_fetch = chunk_of_summaries.length == limit
    iteration += 1
  end
rescue UltracartClient::ApiError => e
  puts "ApiError occurred on iteration #{iteration}"
  puts e.inspect
  exit 1
end

# this will be verbose...
puts summaries.inspect