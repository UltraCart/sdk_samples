from ultracart import ApiException
from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_item, delete_sample_item

try:
    # Insert a sample item
    item_id = insert_sample_item()

    # Create Item API client
    item_api = ItemApi(api_client())

    # Expand pricing information
    expand = "pricing"

    # Get the item by merchant item ID
    api_response = item_api.get_item_by_merchant_item_id(item_id, expand=expand)
    item = api_response.item

    # Store original price
    original_price = item['pricing']['cost']

    # Update the item's price
    item_pricing = item['pricing']
    item_pricing.cost = 12.99

    # Update the item
    api_response = item_api.update_item(item.merchant_item_oid, item, expand=expand)
    updated_item = api_response.item

    # Print price changes
    print(f'Original Price: {original_price}')
    print(f"Updated Price: {updated_item['pricing']['cost']}")

    # Delete the sample item
    delete_sample_item(item_id)

    print("Item update successful")

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)