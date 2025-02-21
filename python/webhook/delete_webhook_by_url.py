"""
This method can be confusing due to its payload.  The method does indeed delete a webhook by url, but you need to
pass a webhook object in as the payload.  However, only the url is used.  UltraCart does this to avoid any confusion
with the rest url versus the webhook url.

To use:
Get your webhook url.
Create a Webhook object.
Set the Webhook url property.
Pass the webhook to deleteWebhookByUrl()

Returns status code 204 (No Content) on success
"""

from ultracart.apis import WebhookApi
from ultracart.models import Webhook
from samples import api_client

# Create Webhook API instance
webhook_api = WebhookApi(api_client())

# Webhook URL to delete
webhook_url = "https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php"

# Create Webhook object with the URL
webhook = Webhook(webhook_url=webhook_url)

# Delete webhook by URL
webhook_api.delete_webhook_by_url(webhook)