package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class InsertUpdateItemContentAttribute {
    public static void execute() throws ApiException {
        /*
            While UltraCart provides a means for updating item content, it is StoreFront specific. This method allows for
            item-wide update of content, such as SEO fields. The content attribute has three fields:
            1) name
            2) value
            3) type: boolean,color,definitionlist,html,integer,mailinglist,multiline,rgba,simplelist,string,videolist

            The SEO content has the following names:
            Item Meta Title = "storefrontSEOTitle"
            Item Meta Description = "storefrontSEODescription"
            Item Meta Keywords = "storefrontSEOKeywords"

            The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
            ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid

            Success will return back a status code of 204 (No Content)
        */

        ItemApi itemApi = new ItemApi(Constants.API_KEY);
        int merchantItemOid = 12345;

        ItemContentAttribute attribute = new ItemContentAttribute();
        attribute.setName("storefrontSEOKeywords");
        attribute.setValue("dog,cat,fish");
        attribute.setType("string");

        itemApi.insertUpdateItemContentAttribute(merchantItemOid, attribute);
    }
}