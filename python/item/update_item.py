from flask import Flask
from ultracart import ApiException
from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_item, delete_sample_item

app = Flask(__name__)


@app.route('/update_item')
def update_item():
    try:
        # Insert a sample item
        item_id = insert_sample_item()

        # Create Item API client
        item_api = ItemApi(api_client())

        # Expand pricing information
        expand = "pricing"

        # Get the item by merchant item ID
        api_response = item_api.get_item_by_merchant_item_id(item_id, expand=expand, _expand=False)
        item = api_response.get_item()

        # Store original price
        original_price = item.get_pricing().get_cost()

        # Update the item's price
        item_pricing = item.get_pricing()
        item_pricing.set_cost(12.99)

        # Update the item
        api_response = item_api.update_item(item.get_merchant_item_oid(), item, expand=expand, _expand=False)
        updated_item = api_response.get_item()

        # Print price changes
        print(f'Original Price: {original_price}')
        print(f'Updated Price: {updated_item.get_pricing().get_cost()}')

        # Delete the sample item
        delete_sample_item(item_id)

        return "Item update successful"

    except ApiException as e:
        print('An ApiException occurred. Please review the following error:')
        print(e)
        return "Error updating item", 500


if __name__ == '__main__':
    app.run(debug=True)