from flask import Flask
from ultracart import ApiException
from ultracart.apis import ItemApi
from ultracart.models import ItemsRequest
from samples import api_client
from item_functions import insert_sample_item, delete_sample_item

app = Flask(__name__)

@app.route('/update_multiple_items')
def update_multiple_items():
    try:
        # Insert two sample items
        item_id1 = insert_sample_item()
        item_id2 = insert_sample_item()

        # Create Item API client
        item_api = ItemApi(api_client())

        # Expand pricing information
        expand = "pricing"

        # Get items by merchant item IDs
        api_response = item_api.get_item_by_merchant_item_id(item_id1, expand=expand, _expand=False)
        item1 = api_response.get_item()
        api_response = item_api.get_item_by_merchant_item_id(item_id2, expand=expand, _expand=False)
        item2 = api_response.get_item()

        # Update prices of items
        item1.get_pricing().set_cost(12.99)
        item2.get_pricing().set_cost(14.99)

        # Create items request
        update_items_request = ItemsRequest()
        items = [item1, item2]
        update_items_request.items = items

        # Update multiple items
        item_api.update_items(update_items_request, expand=expand, _expand=False, _async=False)

        # Delete sample items
        delete_sample_item(item_id1)
        delete_sample_item(item_id2)

        return "Multiple items updated successfully"

    except ApiException as e:
        print('An ApiException occurred. Please review the following error:')
        print(e)
        return "Error updating items", 500

if __name__ == '__main__':
    app.run(debug=True)