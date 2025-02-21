"""
Adds a new webhook on the account with multiple event subscriptions.
"""

from ultracart.apis import WebhookApi
from ultracart.models import Webhook, WebhookEventCategory, WebhookEventSubscription
from samples import api_client

def create_webhook():
    webhook_api = WebhookApi(api_client())

    # Configure webhook
    webhook = Webhook(
        webhook_url="https://www.mywebiste.com/page/to/call/when/this/webhook/fires.php",
        authentication_type="basic",
        basic_username="george",
        basic_password="LlamaLlamaRedPajama",
        maximum_events=10,
        maximum_size=5242880,  # 5 MB
        api_version="2017-03-01",
        compress_events=True
    )

    # Define event subscriptions
    event_subs = [
        WebhookEventSubscription(
            event_name="order_create",
            event_description="when an order is placed",
            expansion="shipping,billing,item,coupon,summary",
            event_ruler=None,
            comments="Merchant specific comment about webhook"
        ),
        WebhookEventSubscription(
            event_name="order_update",
            event_description="when an order is modified",
            expansion="shipping,billing,item,coupon,summary",
            event_ruler=None,
            comments="Merchant specific comment about webhook"
        ),
        WebhookEventSubscription(
            event_name="order_delete",
            event_description="when an order is deleted",
            expansion="",
            event_ruler=None,
            comments="Merchant specific comment about webhook"
        )
    ]

    # Create event category
    event_category = WebhookEventCategory(
        event_category="order",
        events=event_subs
    )

    # Insert webhook
    api_response = webhook_api.insert_webhook(webhook, False)

    if api_response.error:
        print(f"Developer Message: {api_response.error.developer_message}")
        print(f"User Message: {api_response.error.user_message}")
        return None

    return api_response.webhook

# Execute webhook creation
created_webhook = create_webhook()
if created_webhook:
    print(created_webhook)