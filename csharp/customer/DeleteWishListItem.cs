using System;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;
using SdkSample.item;

namespace SdkSample.customer
{
    public class DeleteWishListItem
    {
        /**
         * The wishlist methods allow management of a customer's wishlist.
         * This includes:
         *     DeleteWishListItem
         *     GetCustomerWishList
         *     GetCustomerWishListItem
         *     InsertWishListItem
         *     UpdateWishListItem
         * These methods provide a standard CRUD interface. The example below uses all of them.
         *
         * You'll need merchant_item_oids to insert wishlist items. If you don't know the oids,
         * call ItemApi.GetItemByMerchantItemId() to retrieve the item, then get item.MerchantItemOid
         *
         * Note: Priority of wishlist item, 3 being low priority and 5 is high priority.
         */
        public static void Execute()
        {
            try
            {
                CustomerApi customerApi = new CustomerApi(Constants.ApiKey);

                // create a few items first.
                int firstItemOid = ItemFunctions.InsertSampleItemAndGetOid();
                int secondItemOid = ItemFunctions.InsertSampleItemAndGetOid();

                // create a customer
                int customerOid = CustomerFunctions.InsertSampleCustomer();

                // TODO: If you don't know the customer oid, use GetCustomerByEmail() to retrieve the customer.

                // add some wish list items.
                CustomerWishListItem addWishItem = new CustomerWishListItem();
                addWishItem.CustomerProfileOid = customerOid;
                addWishItem.MerchantItemOid = firstItemOid;
                addWishItem.Comments = "I really want this for my birthday";
                addWishItem.Priority = 3; // Priority of wishlist item, 3 being low priority and 5 is high priority.
                CustomerWishListItem firstCreatedWishItem = customerApi.InsertWishListItem(customerOid, addWishItem);

                addWishItem = new CustomerWishListItem();
                addWishItem.CustomerProfileOid = customerOid;
                addWishItem.MerchantItemOid = secondItemOid;
                addWishItem.Comments = "Christmas Idea!";
                addWishItem.Priority = 5; // Priority of wishlist item, 3 being low priority and 5 is high priority.
                CustomerWishListItem secondCreatedWishItem = customerApi.InsertWishListItem(customerOid, addWishItem);

                // retrieve one wishlist item again
                CustomerWishListItem firstCreatedWishItemCopy = customerApi.GetCustomerWishListItem(customerOid, firstCreatedWishItem.CustomerWishlistItemOid).WishlistItem;
                // retrieve all wishlist items
                CustomerWishListItemsResponse allWishListItems = customerApi.GetCustomerWishList(customerOid);

                // update an item.
                secondCreatedWishItem.Priority = 4;
                CustomerWishListItem updatedSecondWishItem = customerApi.UpdateWishListItem(customerOid, secondCreatedWishItem.CustomerWishlistItemOid, secondCreatedWishItem);

                // delete a wish list item
                customerApi.DeleteWishListItem(customerOid, firstCreatedWishItem.CustomerWishlistItemOid);

                // Clean up
                CustomerFunctions.DeleteSampleCustomer(customerOid);
                ItemFunctions.DeleteSampleItemByOid(firstItemOid);
                ItemFunctions.DeleteSampleItemByOid(secondItemOid);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("An Exception occurred. Please review the following error:");
                Console.Error.WriteLine(ex); // <-- change_me: handle gracefully
                Environment.Exit(1);
            }
        }
    }
}