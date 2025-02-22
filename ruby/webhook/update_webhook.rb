require 'ultracart_api'
require_relative '../constants'

# Updates a webhook on the account.  See insertWebhook.php for a complete example with field usage.
# For this example, we are just updating the basic password.

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

# you should have stored this when you created the webhook.  If you don't know it, call getWebhooks and iterate through
# them to find you target webhook (add useful comments to each webhook really helps in this endeavor) and get the
# webhook oid from that.  You'll want to call getWebhooks any way to get the object for updating. It is HIGHLY
# recommended to get the object from UltraCart for updating rather than constructing it yourself to avoid accidentally
# deleting a part of the object during the update.
webhook_oid = 123456789

webhook_to_update = nil
opts = {
  '_sort' => nil,
  '_placeholders' => nil
}
webhooks = webhook_api.get_webhooks(100, 0, opts).webhooks
webhooks.each do |webhook|
  if webhook.webhook_oid == webhook_oid
    webhook_to_update = webhook
    break
  end
end

webhook_to_update.basic_password = "new password here"
api_response = webhook_api.update_webhook(webhook_oid, webhook_to_update)
updated_webhook = api_response.webhook

if api_response.error
  puts api_response.error.developer_message
  puts api_response.error.user_message
  exit
end

puts updated_webhook.inspect