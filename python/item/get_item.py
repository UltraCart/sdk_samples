from ultracart.apis import ItemApi, CustomerApi
from samples import api_client
from item_functions import insert_sample_item, delete_sample_item

try:
    """
    Of the two getItem methods, you'll probably always use get_item_by_merchant_item_id instead of this one.
    Most item work is done with the item id, not the item oid. The latter is only meaningful as a primary
    key in the UltraCart databases. But here is an example of using get_item(). We take the long route here
    of retrieving the item using get_item_by_merchant_item_id to obtain the oid rather than hard-coding it.
    We do this because these samples are used in our quality control system and run repeatedly.
    """

    # Insert a sample item
    item_id = insert_sample_item()

    # Create API clients
    item_api = ItemApi(api_client())
    customer_api = CustomerApi(api_client())  # only needed for accessing reviewer information below

    # The expand variable is None in the following call. We just need the base object this time.
    api_response = item_api.get_item_by_merchant_item_id(item_id, expand=None, active=False)
    item = api_response.get_item()  # assuming this succeeded

    merchant_item_oid = item.get_merchant_item_oid()

    """
    The real devil in the getItem calls is the expansion, making sure you return everything you need without
    returning everything since these objects are extremely large.

    These are the possible expansion values:
    accounting, amember, auto_order, auto_order.steps, ccbill, channel_partner_mappings,
    chargeback, checkout, content, content.assignments, content.attributes, content.multimedia,
    content.multimedia.thumbnails, digital_delivery, ebay, email_notifications, enrollment123,
    gift_certificate, google_product_search, kit_definition, identifiers,
    instant_payment_notifications, internal, options, payment_processing, physical, pricing,
    pricing.tiers, realtime_pricing, related, reporting, restriction, reviews,
    reviews.individual_reviews, salesforce, shipping, shipping.cases, shipping.destination_markups,
    shipping.destination_restrictions, shipping.distribution_centers, shipping.methods,
    shipping.package_requirements, tax, third_party_email_marketing, variations, wishlist_member
    """
    # Expand reviews to illustrate accessing product reviews
    expand = "reviews,reviews.individual_reviews"
    api_response = item_api.get_item(merchant_item_oid, expand=expand, active=False)
    item = api_response.get_item()

    item_reviews = item.get_reviews()
    individual_reviews = item_reviews.get_individual_reviews()

    # Iterate through individual reviews
    for individual_review in individual_reviews:
        # Access rating names and scores (configurable by merchant)
        # See Home -> Configuration -> Items -> Reviews -> Settings
        # Or this URL: https://secure.ultracart.com/merchant/item/review/reviewSettingsLoad.do
        rating_name1 = individual_review.get_rating_name1()  # Not the full question, but a key string
        rating_score1 = individual_review.get_rating_score1()

        # Retrieve reviewer information (careful: can result in many API calls)
        # Consider adding sleep calls and caching results daily or weekly
        customer_response = customer_api.get_customer(
            individual_review.get_customer_profile_oid(),
            expand="reviewer"
        )
        customer = customer_response.get_customer()
        reviewer = customer.get_reviewer()

    print('The following item was retrieved via get_item():')
    print(item)

    # Delete the sample item
    delete_sample_item(merchant_item_oid)

except Exception as e:
    print('An exception occurred. Please review the following error:')
    print(e)
    raise