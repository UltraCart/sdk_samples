// noinspection DuplicatedCode

import {itemApi} from '../api.js';

export class ItemFunctions {
    /**
     * Creates a sample item with random ID
     * @returns {Promise<string>} The newly created item id
     */
    static async insertSampleItem() {
        const chars = "ABCDEFGH";
        const rand = Array.from({length: chars.length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const itemId = `sample_${rand}`;

        console.log(`InsertSampleItem will attempt to create item ${itemId}`);

        const newItem = {
            merchant_item_id: itemId,
            pricing: {
                cost: 9.99
            },
            description: `Sample description for item ${itemId}`,
            content: {
                multimedia: [{
                    url: "https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png",
                    code: "default", // <-- use 'default' to make this the default item.
                    description: "Some random image i nabbed from wikipedia"
                }]
            }
        };

        const expand = "content.multimedia"; // I want to see the multimedia returned on the newly created object.

        console.log("InsertItem request object follows:");
        console.log(newItem);

        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.insertItem(
                newItem,
                {_expand: expand}, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        console.log("InsertItem response object follows:");
        console.log(apiResponse);

        return apiResponse.item === undefined || apiResponse.item.merchant_item_id === undefined
            ? "ERR_NO_ID"
            : apiResponse.item.merchant_item_id;
    }

    /**
     * Creates a sample item with random ID
     * @returns {Promise<number>} The newly created merchant item oid
     */
    static async insertSampleItemAndGetOid() {
        const chars = "ABCDEFGH";
        const rand = Array.from({length: chars.length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        const itemId = `sample_${rand}`;

        console.log(`InsertSampleItem will attempt to create item ${itemId}`);

        const newItem = {
            merchant_item_id: itemId,
            pricing: {
                cost: 9.99
            },
            description: `Sample description for item ${itemId}`,
            content: {
                multimedia: [{
                    url: "https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png",
                    code: "default", // <-- use 'default' to make this the default item.
                    description: "Some random image i nabbed from wikipedia"
                }]
            }
        };

        const expand = "content.multimedia"; // I want to see the multimedia returned on the newly created object.

        console.log("InsertItem request object follows:");
        console.log(newItem);

        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.insertItem(
                newItem,
                {
                    _expand: expand
                }, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        console.log("InsertItem response object follows:");
        console.log(apiResponse);

        return apiResponse.item === undefined || apiResponse.item.merchant_item_oid === undefined
            ? 0
            : apiResponse.item.merchant_item_oid;
    }

    /**
     * Deletes a sample item by its oid
     * @param {number} merchantItemOid The item oid to be deleted
     */
    static async deleteSampleItemByOid(merchantItemOid) {
        console.log(`Calling DeleteItem(${merchantItemOid})`);
        await new Promise((resolve, reject) => {
            itemApi.deleteItem(
                merchantItemOid
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
    }

    /**
     * Deletes a sample item by its id
     * @param {string} merchantItemId The item id to be deleted
     */
    static async deleteSampleItem(merchantItemId) {
        const getItemResponse = await new Promise((resolve, reject) => {
            itemApi.getItemByMerchantItemId(
                merchantItemId
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        const merchantItemOid = getItemResponse.item?.merchant_item_oid;

        console.log(`Calling DeleteItem(${merchantItemOid})`);
        if (merchantItemOid !== undefined) {
            await new Promise((resolve, reject) => {
                itemApi.deleteItem(
                    merchantItemOid
                    , function (error, data, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(data);
                        }
                    });
            });
        }
    }

    /**
     * Creates a sample digital item
     * @param {string} [externalId] Optional external ID for the digital item
     * @returns {Promise<number>} The digital item oid for the newly created item
     */
    static async insertSampleDigitalItem(externalId) {
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b7/Earth_%2816530938850%29.jpg"; // picture of the earth

        const digitalItem = {
            import_from_url: imageUrl,
            description: "The Earth",
            click_wrap_agreement: "By purchasing this item, you agree that it is Earth"
        };

        if (externalId !== undefined) {
            digitalItem.external_id = externalId;
        }

        console.log("InsertDigitalItem request object follows:");
        console.log(digitalItem);

        const apiResponse = await new Promise((resolve, reject) => {
            itemApi.insertDigitalItem(
                digitalItem
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });

        console.log("InsertDigitalItem response object follows:");
        console.log(apiResponse);

        return apiResponse.digital_item === undefined || apiResponse.digital_item.digital_item_oid === undefined
            ? 0
            : apiResponse.digital_item.digital_item_oid;
    }

    /**
     * Deletes a sample digital item by its oid
     * @param {number} digitalItemOid The primary key of the digital item to be deleted
     */
    static async deleteSampleDigitalItem(digitalItemOid) {
        console.log(`Calling DeleteDigitalItem(${digitalItemOid})`);
        await new Promise((resolve, reject) => {
            itemApi.deleteDigitalItem(
                digitalItemOid
                , function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
    }
}