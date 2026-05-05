from ultracart import ApiException
from ultracart.apis import ItemApi
from ultracart.models import ItemsRequest
from samples import api_client
from item_functions import insert_sample_item, delete_sample_item


try:
    # Insert two sample items
    item_id1 = insert_sample_item()
    item_id2 = insert_sample_item()

    # Create Item API client
    item_api = ItemApi(api_client())

    # Expand pricing information
    expand = "pricing"

    # Get items by merchant item IDs
    api_response = item_api.get_item_by_merchant_item_id(item_id1, expand=expand)
    item1 = api_response.item
    api_response = item_api.get_item_by_merchant_item_id(item_id2, expand=expand)
    item2 = api_response.item

    # Update prices of items
    item1.pricing.cost = 12.99
    item2.pricing.cost = 14.99

    # Create items request
    update_items_request = ItemsRequest()
    items = [item1, item2]
    update_items_request.items = items

    # Update multiple items
    item_api.update_items(update_items_request, expand=expand)

    # Delete sample items
    delete_sample_item(item_id1)
    delete_sample_item(item_id2)

    print("Multiple items updated successfully")

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)

