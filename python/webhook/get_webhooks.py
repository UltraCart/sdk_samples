"""
This example illustrates how to retrieve all webhooks.
"""

from ultracart.apis import WebhookApi
from ultracart.exceptions import ApiException
from samples import api_client


def get_webhook_chunk(webhook_api, offset, limit):
    """Retrieve a chunk of webhooks."""
    _sort = None  # default sorting is webhook_url, disabled
    _placeholders = None  # useful for UI displays, but not needed here

    api_response = webhook_api.get_webhooks(limit=limit, offset=offset, sort=_sort, placeholders=_placeholders)
    return api_response.webhooks or []


def retrieve_all_webhooks():
    """Retrieve all webhooks in chunks."""
    webhook_api = WebhookApi(api_client())

    webhooks = []
    iteration = 1
    offset = 0
    limit = 200

    try:
        while True:
            print(f"executing iteration {iteration}")

            chunk_of_webhooks = get_webhook_chunk(webhook_api, offset, limit)
            webhooks.extend(chunk_of_webhooks)

            offset += limit
            if len(chunk_of_webhooks) < limit:
                break

            iteration += 1

    except ApiException as e:
        print(f'ApiException occurred on iteration {iteration}')
        print(e)
        return None

    return webhooks


# Retrieve and print webhooks
all_webhooks = retrieve_all_webhooks()
if all_webhooks is not None:
    print(all_webhooks)