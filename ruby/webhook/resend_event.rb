require 'ultracart_api'
require_relative '../constants'

# resentEvent is used to reflow an event.  It will resend ALL events in history.  So it is essentially a way to
# get all objects from an event.  Currently, there are only two events available for reflow: "item_update", and "order_create".
# These two events provide the means to have a webhook receive all items or orders.  This method is usually called
# at the beginning of a webhook's life to prepopulate a merchant's database with all items or orders.
#
# You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

webhook_oid = 123456789 # call getWebhooks if you don't know this.
event_name = "item_update" # or "order_create", but for this sample, we want all items.

api_response = webhook_api.resend_event(webhook_oid, event_name)
reflow = api_response.reflow
success = reflow.queued

if api_response.error
  puts api_response.error.developer_message
  puts api_response.error.user_message
  exit
end

puts api_response.inspect