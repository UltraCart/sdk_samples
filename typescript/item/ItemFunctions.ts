// noinspection DuplicatedCode

import { itemApi } from '../api';
import { Item, ItemContent, ItemContentMultimedia, ItemPricing, ItemResponse, ItemDigitalItem, ItemDigitalItemResponse } from 'ultracart_rest_api_v2_typescript';

export class ItemFunctions {
    /// <summary>
    /// Creates a sample item with random ID
    /// </summary>
    /// <returns>The newly created item id</returns>
    public static async insertSampleItem(): Promise<string> {
        const chars = "ABCDEFGH";
        const rand = Array.from({ length: chars.length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const itemId = `sample_${rand}`;

        console.log(`InsertSampleItem will attempt to create item ${itemId}`);

        const newItem: Item = {
            merchant_item_id: itemId,
            pricing: {
                cost: 9.99
            } as ItemPricing,
            description: `Sample description for item ${itemId}`,
            content: {
                multimedia: [{
                    url: "https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png",
                    code: "default", // <-- use 'default' to make this the default item.
                    description: "Some random image i nabbed from wikipedia"
                } as ItemContentMultimedia]
            } as ItemContent
        };

        const expand = "content.multimedia"; // I want to see the multimedia returned on the newly created object.

        console.log("InsertItem request object follows:");
        console.log(newItem);

        const apiResponse: ItemResponse = await itemApi.insertItem({ item: newItem, expand: expand });

        console.log("InsertItem response object follows:");
        console.log(apiResponse);

        return apiResponse.item === undefined || apiResponse.item.merchant_item_id === undefined  ? "ERR_NO_ID" : apiResponse.item.merchant_item_id;
    }

    /// <summary>
    /// Creates a sample item with random ID
    /// </summary>
    /// <returns>The newly created merchant item oid</returns>
    public static async insertSampleItemAndGetOid(): Promise<number> {
        const chars = "ABCDEFGH";
        const rand = Array.from({ length: chars.length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const itemId = `sample_${rand}`;

        console.log(`InsertSampleItem will attempt to create item ${itemId}`);

        const newItem: Item = {
            merchant_item_id: itemId,
            pricing: {
                cost: 9.99
            } as ItemPricing,
            description: `Sample description for item ${itemId}`,
            content: {
                multimedia: [{
                    url: "https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png",
                    code: "default", // <-- use 'default' to make this the default item.
                    description: "Some random image i nabbed from wikipedia"
                } as ItemContentMultimedia]
            } as ItemContent
        };

        const expand = "content.multimedia"; // I want to see the multimedia returned on the newly created object.

        console.log("InsertItem request object follows:");
        console.log(newItem);

        const apiResponse: ItemResponse = await itemApi.insertItem({ item: newItem, expand: expand });

        console.log("InsertItem response object follows:");
        console.log(apiResponse);

        return apiResponse.item === undefined || apiResponse.item.merchant_item_oid === undefined  ? 0 : apiResponse.item.merchant_item_oid;
    }

    /// <summary>
    /// Deletes a sample item by its oid
    /// </summary>
    /// <param name="merchantItemOid">The item oid to be deleted</param>
    public static async deleteSampleItemByOid(merchantItemOid: number): Promise<void> {
        console.log(`Calling DeleteItem(${merchantItemOid})`);
        await itemApi.deleteItem({ merchantItemOid: merchantItemOid });
    }

    /// <summary>
    /// Deletes a sample item by its id
    /// </summary>
    /// <param name="merchantItemId">The item id to be deleted</param>
    public static async deleteSampleItem(merchantItemId: string): Promise<void> {
        const merchantItemOid: number|undefined = (await itemApi.getItemByMerchantItemId({ merchantItemId: merchantItemId })).item?.merchant_item_oid;

        console.log(`Calling DeleteItem(${merchantItemOid})`);
        if(merchantItemOid !== undefined) {
            await itemApi.deleteItem({ merchantItemOid: merchantItemOid });
        }
    }

    /// <summary>
    /// Creates a sample digital item
    /// </summary>
    /// <param name="externalId">Optional external ID for the digital item</param>
    /// <returns>The digital item oid for the newly created item</returns>
    public static async insertSampleDigitalItem(externalId?: string): Promise<number> {
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg"; // picture of the earth

        const digitalItem: ItemDigitalItem = {
            import_from_url: imageUrl,
            description: "The Earth",
            click_wrap_agreement: "By purchasing this item, you agree that it is Earth"
        };

        if (externalId !== undefined) {
            digitalItem.external_id = externalId;
        }

        console.log("InsertDigitalItem request object follows:");
        console.log(digitalItem);

        const apiResponse: ItemDigitalItemResponse = await itemApi.insertDigitalItem({ digitalItem: digitalItem });

        console.log("InsertDigitalItem response object follows:");
        console.log(apiResponse);

        return apiResponse.digital_item === undefined || apiResponse.digital_item.digital_item_oid === undefined  ? 0 : apiResponse.digital_item.digital_item_oid;
    }

    /// <summary>
    /// Deletes a sample digital item by its oid
    /// </summary>
    /// <param name="digitalItemOid">The primary key of the digital item to be deleted</param>
    public static async deleteSampleDigitalItem(digitalItemOid: number): Promise<void> {
        console.log(`Calling DeleteDigitalItem(${digitalItemOid})`);
        await itemApi.deleteDigitalItem({ digitalItemOid: digitalItemOid });
    }
}