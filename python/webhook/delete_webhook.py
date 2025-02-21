"""
deletes a webhook

You will need the webhook_oid to call this method.  Call getWebhooks() if you don't know your oid.
Returns status code 204 (No Content) on success
"""

from ultracart.apis import WebhookApi
from samples import api_client

# Create Webhook API instance
webhook_api = WebhookApi(api_client())

# webhook_oid to delete (call getWebhooks if you don't know this)
webhook_oid = 123456789

# Delete the webhook
webhook_api.delete_webhook(webhook_oid=webhook_oid)