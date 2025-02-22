require 'ultracart_api'
require_relative '../constants'

# This example illustrates how to retrieve all webhooks.

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

def get_webhook_chunk(webhook_api, offset, limit)
  _sort = nil # default sorting is webhook_url, disabled, and those are also the two choices for sorting.
  _placeholders = nil  # useful for UI displays, but not needed here.
  # Pay attention to whether limit or offset comes first in the method signature.  UltraCart is not consistent with their ordering.
  opts = {
    '_sort' => _sort,
    '_placeholders' => _placeholders
  }
  api_response = webhook_api.get_webhooks(limit, offset, opts)

  return api_response.webhooks if api_response.webhooks
  []
end

webhooks = []

iteration = 1
offset = 0
limit = 200
more_records_to_fetch = true

begin
  while more_records_to_fetch
    puts "executing iteration #{iteration}"

    chunk_of_webhooks = get_webhook_chunk(webhook_api, offset, limit)
    webhooks.concat(chunk_of_webhooks)
    offset = offset + limit
    more_records_to_fetch = chunk_of_webhooks.length == limit
    iteration += 1
  end
rescue UltracartClient::ApiError => e
  puts "ApiError occurred on iteration #{iteration}"
  puts e.inspect
  exit 1
end

# this will be verbose...
puts webhooks.inspect