require 'ultracart_api'
require_relative '../constants'

# This method can be confusing due to its payload.  The method does indeed delete a webhook by url, but you need to
# pass a webhook object in as the payload.  However, only the url is used.  UltraCart does this to avoid any confusion
# with the rest url versus the webhook url.
#
# To use:
# Get your webhook url.
# Create a Webhook object.
# Set the Webhook url property.
# Pass the webhook to deleteWebhookByUrl()
#
# Returns status code 204 (No Content) on success

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)

webhook_url = "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php"
webhook = UltracartClient::Webhook.new
webhook.webhook_url = webhook_url

webhook_api.delete_webhook_by_url(webhook)