# Delete a specific user review for an item
#
# This would most likely be used by a merchant who has cached all
# reviews on a separate site and then wishes to remove a particular review.
#
# The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
# ItemApi.get_item_by_merchant_item_id() to retrieve the item, and then get its oid
#
# The review_oid is a unique identifier used by UltraCart. If you do not know a review's oid, call
# ItemApi.get_reviews() to get all reviews where you can then grab the oid from an item.
#
# Success returns back a status code of 204 (No Content)

from ultracart.apis import ItemApi
from samples import api_client

# Create item API instance
item_api = ItemApi(api_client())

# Specify item and review OIDs
merchant_item_oid = 123456
review_oid = 987654

# Delete the review
item_api.delete_review(review_oid, merchant_item_oid)