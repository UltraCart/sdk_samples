from ultracart.apis import ItemApi
from samples import api_client

"""
Retrieves a specific user review for an item. This would most likely be used by a merchant 
who has cached all reviews on a separate site and then wishes to update a particular review. 
It's always best to "get" the object, make changes to it, then call the update instead of 
trying to recreate the object from scratch.

The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your 
item's oid, call ItemApi.get_item_by_merchant_item_id() to retrieve the item, and then 
get its oid via $item.get_merchant_item_oid()

The review_oid is a unique identifier used by UltraCart. If you do not know a review's oid, 
call ItemApi.get_reviews() to get all reviews where you can then grab the oid from an item.
"""

# Create Item API client
item_api = ItemApi(api_client())

# Example OIDs (replace with actual values)
merchant_item_oid = 226937
review_oid = 206522

# Retrieve the specific review
api_response = item_api.get_review(review_oid, merchant_item_oid)

# Check for errors
if hasattr(api_response, 'error') and api_response.error is not None:
    error = api_response.error
    print(f"Developer Message: {error.developer_message}")
    print(f"User Message: {error.user_message}")
    raise Exception("Review retrieval failed")

else:
    # Get the review
    review = api_response.review

    # Print the review
    # print(review)