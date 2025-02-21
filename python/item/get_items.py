import sys
from ultracart.apis import ItemApi
from samples import api_client


def get_item_chunk(item_api, offset, limit):
    """
    Retrieve a chunk of items with specified expansion.

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
    # Expansion of commonly needed item details
    expand = "kit_definition,options,shipping,tax,variations"

    # Retrieve items with no category filtering
    api_response = item_api.get_items(
        parent_category_id=None,
        parent_category_path=None,
        limit=limit,
        offset=offset,
        since=None,
        sort=None,
        expand=expand,
        active=False
    )

    return api_response.get_items() or []


def main():
    """
    Retrieve all items in chunks.

    Note: Categories in UltraCart are essentially folders to organize items.
    They do not impact checkout or storefront display.
    """
    # Create Item API client
    item_api = ItemApi(api_client())

    items = []
    iteration = 1
    offset = 0
    limit = 200
    more_records_to_fetch = True

    try:
        while more_records_to_fetch:
            print(f"Executing iteration {iteration}")

            chunk_of_items = get_item_chunk(item_api, offset, limit)
            items.extend(chunk_of_items)

            offset += limit
            more_records_to_fetch = len(chunk_of_items) == limit
            iteration += 1

    except Exception as e:
        print(f'Exception occurred on iteration {iteration}')
        print(e)
        sys.exit(1)

    # Print all retrieved items (will be verbose)
    print(items)


if __name__ == "__main__":
    main()