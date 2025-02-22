require 'ultracart_api'
require_relative '../constants'

# getWebhookLog() provides a detail log of a webhook event.  It is used in tandem with getWebhookLogSummaries to audit
# webhook events.  This method call will require the webhook_oid and the request_id.  The webhook_oid can be discerned
# from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries().  see those examples
# if needed.

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

webhook_oid = 123456789 # call getWebhooks if you don't know this.
request_id = '987654321'  # call getWebhookLogSummaries if you don't know this.

api_response = webhook_api.get_webhook_log(webhook_oid, request_id)
webhook_log = api_response.webhook_log

if api_response.error
  puts api_response.error.developer_message
  puts api_response.error.user_message
  exit
end

puts webhook_log