import random
import string
from typing import Optional

from ultracart.apis import ItemApi
from samples import api_client
from ultracart.models import (
    Item,
    ItemContent,
    ItemContentMultimedia,
    ItemPricing,
    ItemDigitalItem
)


def generate_random_string(length=8):
    """Generate a random string of uppercase letters."""
    return ''.join(random.choices(string.ascii_uppercase, k=length))


def insert_sample_item() -> str:
    """
    Insert a sample item and return the merchant item ID.

    Returns:
        str: The newly created merchant item ID
    """
    # Generate random item ID
    item_id = f'sample_{generate_random_string()}'
    print(f'insertSampleItem will attempt to create item {item_id}')

    # Create item API instance
    item_api = ItemApi(api_client())

    # Create new item
    new_item = Item(
        merchant_item_id=item_id,
        pricing=ItemPricing(cost=9.99),
        description=f'Sample description for item {item_id}',
        content=ItemContent(
            multimedia=[
                ItemContentMultimedia(
                    url='https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png',
                    code='default',
                    description='Some random image i nabbed from wikipedia'
                )
            ]
        )
    )

    # Expansion variable to get multimedia details
    expand = 'content.multimedia'

    print('insertItem request object follows:')
    print(new_item)

    # Insert item
    api_response = item_api.insert_item(new_item, expand=expand)

    print('insertItem response object follows:')
    print(api_response)

    return item_id


def insert_sample_item_and_get_oid() -> int:
    """
    Insert a sample item and return its merchant item OID.

    Returns:
        int: The newly created item's merchant item OID
    """
    # Generate random item ID
    item_id = f'sample_{generate_random_string()}'
    print(f'insertSampleItem will attempt to create item {item_id}')

    # Create item API instance
    item_api = ItemApi(api_client())

    # Create new item
    new_item = Item(
        merchant_item_id=item_id,
        pricing=ItemPricing(cost=9.99),
        description=f'Sample description for item {item_id}',
        content=ItemContent(
            multimedia=[
                ItemContentMultimedia(
                    url='https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png',
                    code='default',
                    description='Some random image i nabbed from wikipedia'
                )
            ]
        )
    )

    # Expansion variable to get multimedia details
    expand = 'content.multimedia'

    print('insertItem request object follows:')
    print(new_item)

    # Insert item
    api_response = item_api.insert_item(new_item, expand=expand)

    print('insertItem response object follows:')
    print(api_response)

    return api_response.item.merchant_item_oid


def delete_sample_item_by_oid(merchant_item_oid: int) -> None:
    """
    Delete a sample item by its merchant item OID.

    Args:
        merchant_item_oid (int): The merchant item OID to delete
    """
    # Create item API instance
    item_api = ItemApi(api_client())

    print(f'calling deleteItem({merchant_item_oid})')
    item_api.delete_item(merchant_item_oid)


def delete_sample_item(item_id: str) -> None:
    """
    Delete a sample item by its merchant item ID.

    Args:
        item_id (str): The merchant item ID to delete
    """
    # Create item API instance
    item_api = ItemApi(api_client())

    print('deleteItem takes the item oid (internal unique identifier), so we need to retrieve the item first to delete')
    print(f'attempting to retrieve the item object for item id {item_id}')

    # Retrieve item to get its OID
    expand = None  # No extra fields needed
    api_response = item_api.get_item_by_merchant_item_id(item_id, expand=expand, skip_cache=False)
    item = api_response.item

    print('The following object was retrieved:')
    print(item)

    merchant_item_oid = item.merchant_item_oid

    print(f'calling deleteItem({merchant_item_oid})')
    item_api.delete_item(merchant_item_oid)


def insert_sample_digital_item(external_id: Optional[str] = None) -> int:
    """
    Insert a sample digital item.

    Args:
        external_id (Optional[str], optional): External ID for the digital item. Defaults to None.

    Returns:
        int: The digital item OID for the newly created item
    """
    # Image URL (Earth picture from Wikipedia)
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg'

    # Create digital item
    digital_item = ItemDigitalItem(
        import_from_url=image_url,
        description="The Earth",
        click_wrap_agreement="By purchasing this item, you agree that it is Earth"
    )

    # Add external ID if provided
    if external_id is not None:
        digital_item.external_id = external_id

    print('insertDigitalItem request object follows:')
    print(digital_item)

    # Create item API instance
    item_api = ItemApi(api_client())

    # Insert digital item
    api_response = item_api.insert_digital_item(digital_item)

    print('insertDigitalItem response object follows:')
    print(api_response)

    return api_response.digital_item.digital_item_oid


def delete_sample_digital_item(digital_item_oid: int) -> None:
    """
    Delete a sample digital item by its digital item OID.

    Args:
        digital_item_oid (int): The primary key of the digital item to be deleted
    """
    # Create item API instance
    item_api = ItemApi(api_client())

    print(f'calling deleteItem({digital_item_oid})')
    item_api.delete_digital_item(digital_item_oid)