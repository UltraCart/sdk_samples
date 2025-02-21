from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_item
from ultracart.exceptions import ApiException
from ultracart.models import ItemReviews, ItemReview

try:
    # Create a sample item
    item_id = insert_sample_item()

    # Initialize Item API
    item_api = ItemApi(api_client())

    # Expand reviews to update item with review template
    expand = 'reviews'

    # Retrieve item by merchant item ID
    item_response = item_api.get_item_by_merchant_item_id(item_id, expand=expand)
    item = item_response.item
    item_oid = item.merchant_item_oid

    # Set review template
    review_template_oid = 402
    reviews = ItemReviews()
    reviews.review_template_oid = review_template_oid
    item.reviews = reviews

    # Update item with review template
    item = item_api.update_item(item_oid, item, expand=expand).item

    # Create a new review
    review = ItemReview(
        title='Best Product Ever!',
        review="I loved this product. I bought it for my wife and she was so happy she cried. blah blah blah",
        reviewed_nickname="Bob420",
        featured=True,
        rating_name1='Durability',
        rating_name2='Price',
        rating_name3='Performance',
        rating_name4='Appearance',
        rating_score1=4.5,
        rating_score2=3.5,
        rating_score3=2.5,
        rating_score4=1.5,
        overall=5.0,
        reviewer_location="Southside Chicago",
        status='approved'
    )

    # Insert the review
    review = item_api.insert_review(item_oid, review).review

    # Print the review
    print("Inserted Review:")
    print(review)

except ApiException as e:
    print('An ApiException occurred. Please review the following error:')
    print(e)
    exit(1)