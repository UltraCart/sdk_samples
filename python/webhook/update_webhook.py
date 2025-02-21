"""
Update a webhook's basic password by retrieving the existing webhook first.
"""

from ultracart.apis import WebhookApi
from samples import api_client

def update_webhook():
   webhook_api = WebhookApi(api_client())

   # Webhook OID to update
   webhook_oid = 123456789

   # Retrieve existing webhooks and find the target
   webhooks = webhook_api.get_webhooks(limit=100, offset=0).webhooks
   webhook_to_update = next((w for w in webhooks if w.webhook_oid == webhook_oid), None)

   if not webhook_to_update:
       print(f"Webhook with OID {webhook_oid} not found")
       return None

   # Update basic password
   webhook_to_update.basic_password = "new password here"

   # Perform update
   api_response = webhook_api.update_webhook(webhook_oid=webhook_oid, webhook=webhook_to_update)

   if api_response.error:
       print(f"Developer Message: {api_response.error.developer_message}")
       print(f"User Message: {api_response.error.user_message}")
       return None

   return api_response.webhook

# Execute webhook update
updated_webhook = update_webhook()
if updated_webhook:
   print(updated_webhook)