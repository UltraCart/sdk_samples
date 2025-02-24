import {customerApi} from '../api.js';
import {ItemFunctions} from '../item/itemFunctions.js';
import {CustomerFunctions} from './customerFunctions.js';

/**
 * The wishlist methods allow management of a customer's wishlist.
 * This includes:
 *     DeleteWishListItem
 *     GetCustomerWishList
 *     GetCustomerWishListItem
 *     InsertWishListItem
 *     UpdateWishListItem
 * These methods provide a standard CRUD interface.
 *
 * You'll need merchant_item_oids to insert wishlist items. If you don't know the oids,
 * call ItemApi.GetItemByMerchantItemId() to retrieve the item, then get item.MerchantItemOid
 *
 * Note: Priority of wishlist item, 3 being low priority and 5 is high priority.
 */
export class GetCustomerWishList  {
    static async execute() {
        try {
            // create a few items first.
            const firstItemOid = await ItemFunctions.insertSampleItemAndGetOid();
            const secondItemOid = await ItemFunctions.insertSampleItemAndGetOid();

            // create a customer
            const customerOid = await CustomerFunctions.insertSampleCustomer();

            // TODO: If you don't know the customer oid, use GetCustomerByEmail() to retrieve the customer.

            // add some wish list items.
            const firstWishItem = {
                customer_profile_oid: customerOid,
                merchant_item_oid: firstItemOid,
                comments: "I really want this for my birthday",
                priority: 3 // Priority of wishlist item, 3 being low priority and 5 is high priority.
            };
            const firstCreatedWishItem = await new Promise((resolve, reject) => {
                customerApi.insertWishListItem(customerOid, firstWishItem, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const secondWishItem = {
                customer_profile_oid: customerOid,
                merchant_item_oid: secondItemOid,
                comments: "Christmas Idea!",
                priority: 5 // Priority of wishlist item, 3 being low priority and 5 is high priority.
            };
            const secondCreatedWishItem = await new Promise((resolve, reject) => {
                customerApi.insertWishListItem(customerOid, secondWishItem, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            if (firstCreatedWishItem === undefined || firstCreatedWishItem.customer_profile_oid === undefined) {
                console.error("first wish list item is undefined.  update failed.");
                return;
            }

            if (secondCreatedWishItem === undefined || secondCreatedWishItem.customer_profile_oid === undefined) {
                console.error("second wish list item is undefined.  update failed.");
                return;
            }

            // retrieve one wishlist item again
            const firstCreatedWishItemCopyResponse = await new Promise((resolve, reject) => {
                customerApi.getCustomerWishListItem(customerOid, firstCreatedWishItem.customer_wishlist_item_oid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const firstCreatedWishItemCopy = firstCreatedWishItemCopyResponse.wishlist_item;

            // retrieve all wishlist items
            const allWishListItems = await new Promise((resolve, reject) => {
                customerApi.getCustomerWishList(customerOid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // update an item.
            const updatedSecondWishItem = await new Promise((resolve, reject) => {
                customerApi.updateWishListItem(customerOid, secondCreatedWishItem.customer_wishlist_item_oid, secondCreatedWishItem, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // delete a wish list item
            await new Promise((resolve, reject) => {
                customerApi.deleteWishListItem(customerOid, firstCreatedWishItem.customer_wishlist_item_oid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // Clean up
            await CustomerFunctions.deleteSampleCustomer(customerOid);
            await ItemFunctions.deleteSampleItemByOid(firstItemOid);
            await ItemFunctions.deleteSampleItemByOid(secondItemOid);
        } catch (ex) {
            console.error("An Exception occurred. Please review the following error:");
            console.error(ex); // <-- change_me: handle gracefully
            process.exit(1);
        }
    }
}