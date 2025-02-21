"""
getWebhookLog() provides a detail log of a webhook event.  It is used in tandem with getWebhookLogSummaries to audit
webhook events.  This method call will require the webhook_oid and the request_id.  The webhook_oid can be discerned
from the results of getWebhooks() and the request_id can be found from getWebhookLogSummaries().  see those examples
if needed.
"""

from ultracart.apis import WebhookApi
from samples import api_client

# Create Webhook API instance
webhook_api = WebhookApi(api_client())

# webhook_oid and request_id (call getWebhooks and getWebhookLogSummaries if you don't know these)
webhook_oid = 123456789
request_id = '987654321'

# Get webhook log
api_response = webhook_api.get_webhook_log(webhook_oid=webhook_oid, request_id=request_id)
webhook_log = api_response.webhook_log

# Check for errors
if api_response.error:
   print(f"Developer Message: {api_response.error.developer_message}")
   print(f"User Message: {api_response.error.user_message}")
else:
   # Print webhook log
   print(webhook_log)