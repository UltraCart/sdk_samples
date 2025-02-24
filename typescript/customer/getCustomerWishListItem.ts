import {customerApi} from '../api';
import {ItemFunctions} from '../item/ItemFunctions';
import {CustomerFunctions} from './CustomerFunctions';
import {
    CustomerWishListItem,
    CustomerWishListItemsResponse,
    CustomerWishListItemResponse
} from 'ultracart_rest_api_v2_typescript';

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
export class GetCustomerWishListItem {
    public static async execute(): Promise<void> {
        try {
            // create a few items first.
            const firstItemOid = await ItemFunctions.insertSampleItemAndGetOid();
            const secondItemOid = await ItemFunctions.insertSampleItemAndGetOid();

            // create a customer
            const customerOid = await CustomerFunctions.insertSampleCustomer();

            // TODO: If you don't know the customer oid, use GetCustomerByEmail() to retrieve the customer.

            // add some wish list items.
            const firstWishItem: CustomerWishListItem = {
                customer_profile_oid: customerOid,
                merchant_item_oid: firstItemOid,
                comments: "I really want this for my birthday",
                priority: 3 // Priority of wishlist item, 3 being low priority and 5 is high priority.
            };
            const firstCreatedWishItem = await customerApi.insertWishListItem({
                customerProfileOid: customerOid,
                wishlistItem: firstWishItem
            });

            const secondWishItem: CustomerWishListItem = {
                customer_profile_oid: customerOid,
                merchant_item_oid: secondItemOid,
                comments: "Christmas Idea!",
                priority: 5 // Priority of wishlist item, 3 being low priority and 5 is high priority.
            };
            const secondCreatedWishItem = await customerApi.insertWishListItem({
                customerProfileOid: customerOid,
                wishlistItem: secondWishItem
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
            const firstCreatedWishItemCopyResponse: CustomerWishListItemResponse =
                await customerApi.getCustomerWishListItem({
                    customerProfileOid: customerOid,
                    customerWishlistItemOid: firstCreatedWishItem.customer_wishlist_item_oid as number
                });
            const firstCreatedWishItemCopy = firstCreatedWishItemCopyResponse.wishlist_item;

            // retrieve all wishlist items
            const allWishListItems: CustomerWishListItemsResponse =
                await customerApi.getCustomerWishList({customerProfileOid: customerOid});

            // update an item.
            const updatedSecondWishItem = await customerApi.updateWishListItem({
                customerProfileOid: customerOid,
                customerWishlistItemOid: secondCreatedWishItem.customer_wishlist_item_oid as number,
                wishlistItem: secondCreatedWishItem
            });

            // delete a wish list item
            await customerApi.deleteWishListItem({
                customerProfileOid: customerOid,
                customerWishlistItemOid: firstCreatedWishItem.customer_wishlist_item_oid as number
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