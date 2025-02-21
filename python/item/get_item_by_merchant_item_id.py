from ultracart.apis import ItemApi
from samples import api_client
from item_functions import insert_sample_item, delete_sample_item

try:
    """
    Most item work is done with the item id, not the item oid. 
    The latter is only meaningful as a primary key in the UltraCart databases.
    """

    # Insert a sample item
    item_id = insert_sample_item()

    # Create Item API client
    item_api = ItemApi(api_client())

    """
    Possible expansion values include:
    accounting, amember, auto_order, auto_order.steps, ccbill, channel_partner_mappings,
    chargeback, checkout, content, content.assignments, content.attributes, 
    content.multimedia, content.multimedia.thumbnails, digital_delivery, ebay, 
    email_notifications, enrollment123, gift_certificate, google_product_search, 
    kit_definition, identifiers, instant_payment_notifications, internal, options, 
    payment_processing, physical, pricing, pricing.tiers, realtime_pricing, related, 
    reporting, restriction, reviews, salesforce, shipping, shipping.cases, 
    shipping.destination_markups, shipping.destination_restrictions, 
    shipping.distribution_centers, shipping.methods, shipping.package_requirements, 
    tax, third_party_email_marketing, variations, wishlist_member
    """
    expand = "kit_definition,options,shipping,tax,variations"
    api_response = item_api.get_item_by_merchant_item_id(item_id, expand=expand, active=False)
    item = api_response.get_item()

    print('The following item was retrieved via get_item_by_merchant_item_id():')
    print(item)

    delete_sample_item(item_id)

except Exception as e:
    print('An exception occurred. Please review the following error:')
    print(e)
    raise