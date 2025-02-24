import { itemApi } from '../api.js';

export class InsertUpdateItemContentAttribute {
    /**
     * While UltraCart provides a means for updating item content, it is StoreFront specific. This method allows for
     * item-wide update of content, such as SEO fields. The content attribute has three fields:
     * 1) name
     * 2) value
     * 3) type: boolean,color,definitionlist,html,integer,mailinglist,multiline,rgba,simplelist,string,videolist
     *
     * The SEO content has the following names:
     * Item Meta Title = "storefrontSEOTitle"
     * Item Meta Description = "storefrontSEODescription"
     * Item Meta Keywords = "storefrontSEOKeywords"
     *
     * The merchant_item_oid is a unique identifier used by UltraCart. If you do not know your item's oid, call
     * ItemApi.GetItemByMerchantItemId() to retrieve the item, and then it's oid item.MerchantItemOid
     *
     * Success will return back a status code of 204 (No Content)
     */
    static async execute() {
        const merchantItemOid = 12345;

        const attribute = {
            name: "storefrontSEOKeywords",
            value: "dog,cat,fish",
            type: "string"
        };

        await new Promise((resolve, reject) => {
            itemApi.insertUpdateItemContentAttribute(merchantItemOid, attribute, function (error, data, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data, response);
                }
            });
        });
    }
}