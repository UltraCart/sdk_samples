from samples import api_client
from ultracart.apis import ItemApi

"""
Retrieves all user reviews for an item.

The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()
"""

# Initialize the Item API
item_api = ItemApi(api_client())

# Specify the merchant item OID
merchant_item_oid = 123456

# Retrieve reviews
api_response = item_api.get_item_reviews(merchant_item_oid)

# Check for errors
if api_response.error is not None:
    print(f"Developer Message: {api_response.error.developer_message}")
    print(f"User Message: {api_response.error.user_message}")
    exit()

# Process and print reviews
reviews = api_response.reviews
for review in reviews:
    print(review)