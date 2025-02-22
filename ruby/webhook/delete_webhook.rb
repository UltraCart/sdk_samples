require 'ultracart_api'
require_relative '../constants'

# deletes a webhook
#
# You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.
# Returns status code 204 (No Content) on success

webhook_api = UltracartClient::WebhookApi.new_using_api_key(Constants::API_KEY)
webhook_oid = 123456789 # call getWebhooks if you don't know this.
webhook_api.delete_webhook(webhook_oid)