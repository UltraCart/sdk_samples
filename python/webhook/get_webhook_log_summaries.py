"""
This example illustrates how to retrieve webhook log summaries.
"""

from datetime import datetime, timedelta
from ultracart.apis import WebhookApi
from ultracart.exceptions import ApiException
from samples import api_client


def get_summary_chunk(webhook_api, offset, limit):
    """Retrieve a chunk of webhook log summaries."""
    webhook_oid = 123456789  # Use getWebhooks to find your webhook's oid
    _since = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%dT00:00:00+00:00')

    api_response = webhook_api.get_webhook_log_summaries(webhook_oid=webhook_oid, limit=limit, offset=offset,
                                                         since=_since)
    return api_response.webhook_log_summaries or []


def retrieve_all_summaries():
    """Retrieve all webhook log summaries in chunks."""
    webhook_api = WebhookApi(api_client())

    summaries = []
    iteration = 1
    offset = 0
    limit = 200

    try:
        while True:
            print(f"executing iteration {iteration}")

            chunk_of_summaries = get_summary_chunk(webhook_api, offset, limit)
            summaries.extend(chunk_of_summaries)

            offset += limit
            if len(chunk_of_summaries) < limit:
                break

            iteration += 1

    except ApiException as e:
        print(f'ApiException occurred on iteration {iteration}')
        print(e)
        return None

    return summaries


# Retrieve and print summaries
all_summaries = retrieve_all_summaries()
if all_summaries is not None:
    print(all_summaries)