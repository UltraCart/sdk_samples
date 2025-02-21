"""
Resend a specific event for a webhook to reflow all historical data.
Supports 'item_update' and 'order_create' events.
"""

from ultracart.apis import WebhookApi
from samples import api_client

def resend_webhook_event():
   webhook_api = WebhookApi(api_client())

   webhook_oid = 123456789  # Use getWebhooks to find your webhook's oid
   event_name = "item_update"  # or "order_create"

   api_response = webhook_api.resend_event(webhook_oid=webhook_oid, event_name=event_name)

   if api_response.error:
       print(f"Developer Message: {api_response.error.developer_message}")
       print(f"User Message: {api_response.error.user_message}")
       return None

   reflow = api_response.reflow
   success = reflow.queued

   return api_response

# Execute event resend
result = resend_webhook_event()
if result:
   print(result)