from ultracart.apis import CustomerApi
from samples import api_client
from ultracart.models import CustomerWishListItem

from customer_functions import insert_sample_customer, delete_sample_customer
from item.item_functions import insert_sample_item_and_get_oid, delete_sample_item_by_oid

def main():
    try:
        # Create customer API instance
        customer_api = CustomerApi(api_client())

        # Create sample items
        first_item_oid = insert_sample_item_and_get_oid()
        second_item_oid = insert_sample_item_and_get_oid()

        # Create a sample customer
        customer_oid = insert_sample_customer()

        # Add first wish list item
        first_wish_item = CustomerWishListItem(
            customer_profile_oid=customer_oid,
            merchant_item_oid=first_item_oid,
            comments="I really want this for my birthday",
            priority=3  # Low priority
        )
        first_created_wish_item = customer_api.insert_wish_list_item(customer_oid, first_wish_item)

        # Add second wish list item
        second_wish_item = CustomerWishListItem(
            customer_profile_oid=customer_oid,
            merchant_item_oid=second_item_oid,
            comments="Christmas Idea!",
            priority=5  # High priority
        )
        second_created_wish_item = customer_api.insert_wish_list_item(customer_oid, second_wish_item)

        # Retrieve one wishlist item
        first_created_wish_item_copy = customer_api.get_customer_wish_list_item(
            customer_oid,
            first_created_wish_item.customer_wishlist_item_oid
        ).wishlist_item

        # Retrieve all wishlist items
        all_wish_list_items = customer_api.get_customer_wish_list(customer_oid).wishlist_items

        # Update an item
        second_created_wish_item.priority = 4
        updated_second_wish_item = customer_api.update_wish_list_item(
            customer_oid,
            second_created_wish_item.customer_wishlist_item_oid,
            second_created_wish_item
        )

        # Delete a wish list item
        customer_api.delete_wish_list_item(
            customer_oid,
            first_created_wish_item.customer_wishlist_item_oid
        )

        # Clean up
        delete_sample_customer(customer_oid)
        delete_sample_item_by_oid(first_item_oid)
        delete_sample_item_by_oid(second_item_oid)

    except Exception as e:
        print('An exception occurred. Please review the following error:')
        print(e)
        import sys
        sys.exit(1)

if __name__ == "__main__":
    main()