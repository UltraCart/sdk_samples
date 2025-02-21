package customer;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.models.CustomerWishListItem;
import com.ultracart.admin.v2.models.CustomerWishListItemsResponse;
import com.ultracart.admin.v2.util.ApiException;
import item.ItemFunctions;
import common.Constants;

public class GetCustomerWishList {
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
    public static void execute() {
        try {
            CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

            // create a few items first.
            int firstItemOid = ItemFunctions.insertSampleItemAndGetOid();
            int secondItemOid = ItemFunctions.insertSampleItemAndGetOid();

            // create a customer
            int customerOid = CustomerFunctions.insertSampleCustomer();

            // TODO: If you don't know the customer oid, use GetCustomerByEmail() to retrieve the customer.

            // add some wish list items.
            CustomerWishListItem addWishItem = new CustomerWishListItem();
            addWishItem.setCustomerProfileOid(customerOid);
            addWishItem.setMerchantItemOid(firstItemOid);
            addWishItem.setComments("I really want this for my birthday");
            addWishItem.setPriority(3); // Priority of wishlist item, 3 being low priority and 5 is high priority.
            CustomerWishListItem firstCreatedWishItem = customerApi.insertWishListItem(customerOid, addWishItem);

            addWishItem = new CustomerWishListItem();
            addWishItem.setCustomerProfileOid(customerOid);
            addWishItem.setMerchantItemOid(secondItemOid);
            addWishItem.setComments("Christmas Idea!");
            addWishItem.setPriority(5); // Priority of wishlist item, 3 being low priority and 5 is high priority.
            CustomerWishListItem secondCreatedWishItem = customerApi.insertWishListItem(customerOid, addWishItem);

            // retrieve one wishlist item again
            CustomerWishListItem firstCreatedWishItemCopy = customerApi.getCustomerWishListItem(customerOid, firstCreatedWishItem.getCustomerWishlistItemOid()).getWishlistItem();

            // retrieve all wishlist items
            CustomerWishListItemsResponse allWishListItems = customerApi.getCustomerWishList(customerOid);

            // update an item.
            secondCreatedWishItem.setPriority(4);
            CustomerWishListItem updatedSecondWishItem = customerApi.updateWishListItem(customerOid, secondCreatedWishItem.getCustomerWishlistItemOid(), secondCreatedWishItem);

            // delete a wish list item
            customerApi.deleteWishListItem(customerOid, firstCreatedWishItem.getCustomerWishlistItemOid());

            // Clean up
            CustomerFunctions.deleteSampleCustomer(customerOid);
            ItemFunctions.deleteSampleItemByOid(firstItemOid);
            ItemFunctions.deleteSampleItemByOid(secondItemOid);
        } catch (ApiException ex) {
            System.err.println("An Exception occurred. Please review the following error:");
            System.err.println(ex);
            System.exit(1);
        }
    }
}