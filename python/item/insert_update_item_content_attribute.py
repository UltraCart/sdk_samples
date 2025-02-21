from samples import api_client
from ultracart.apis import ItemApi
from ultracart.models import ItemContentAttribute

"""
While UltraCart provides a means for updating item content, it is StoreFront specific.  This method allows for
item-wide update of content, such as SEO fields. The content attribute has three fields:
1) name
2) value
3) type: boolean,color,definitionlist,html,integer,mailinglist,multiline,rgba,simplelist,string,videolist

The SEO content has the following names:
Item Meta Title = "storefrontSEOTitle"
Item Meta Description = "storefrontSEODescription"
Item Meta Keywords = "storefrontSEOKeywords"

The merchant_item_oid is a unique identifier used by UltraCart.  If you do not know your item's oid, call
ItemApi.getItemByMerchantItemId() to retrieve the item, and then it's oid $item->getMerchantItemOid()

Success will return back a status code of 204 (No Content)
"""

# Initialize Item API
item_api = ItemApi(api_client())

# Specify the merchant item OID
merchant_item_oid = 12345

# Create content attribute
attribute = ItemContentAttribute(
    name="storefrontSEOKeywords",
    value='dog,cat,fish',
    type="string"
)

# Insert or update the content attribute
item_api.insert_update_item_content_attribute(merchant_item_oid, attribute)