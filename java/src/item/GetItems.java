package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.Item;
import com.ultracart.admin.v2.models.ItemsResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.List;

public class GetItems {
   public static void execute() {
       /*
        * This example illustrates how to retrieve items. When dealing with items, please note that categories are
        * essentially folders to organize and store items. They are only used for that purpose and play no role in
        * the checkout process or in the storefront display of items. So you may organize your items as best serves
        * you. We're often asked why was use the word 'category' instead of 'folder'. We started down the road of
        * item management 27 years ago with the word 'category', and it's too much trouble to change. So items are
        * managed by categories, not folders. But they are folders. :)
        * The call takes two possible parameters:
        * 1) parentCategoryId: This is a number which uniquely identifies a category in our system. Not easy to determine.
        * 2) parentCategoryPath: This is the folder path you wish to retrieve, starting with a forward slash "/"
        * If you provide neither of these values, all items are returned.
        */

       ItemApi itemApi = new ItemApi(Constants.API_KEY);
       List<Item> items = new ArrayList<>();
       
       int iteration = 1;
       int offset = 0;
       int limit = 200;
       boolean moreRecordsToFetch = true;
       
       try {
           while (moreRecordsToFetch) {
               System.out.println("executing iteration " + iteration);
               
               List<Item> chunkOfItems = getItemChunk(itemApi, offset, limit);
               items.addAll(chunkOfItems);
               offset += limit;
               moreRecordsToFetch = chunkOfItems.size() == limit;
               iteration++;
           }
       } catch (ApiException e) {
           System.out.println("ApiException occurred on iteration " + iteration);
           e.printStackTrace();
           System.exit(1);
       }
       
       for (Item item : items) {
           System.out.println(item.toString());
       }
   }
   
   private static List<Item> getItemChunk(ItemApi itemApi, int offset, int limit) throws ApiException {
       // The real devil in the getItem calls is the expansion, making sure you return everything you need without
       // returning everything since these objects are extremely large.
       // These are the possible expansion values.
       /*
       accounting                      amember                     auto_order                      auto_order.steps
       ccbill                          channel_partner_mappings    chargeback                      checkout
       content                         content.assignments         content.attributes              content.multimedia
       content.multimedia.thumbnails   digital_delivery            ebay                            email_notifications
       enrollment123                   gift_certificate            google_product_search           kit_definition
       identifiers                     instant_payment_notifications   internal                    options
       payment_processing              physical                    pricing                         pricing.tiers
       realtime_pricing                related                     reporting                       restriction
       reviews                         salesforce                  shipping                        shipping.cases
       tax                             third_party_email_marketing variations                      wishlist_member
       shipping.destination_markups
       shipping.destination_restrictions
       shipping.distribution_centers
       shipping.methods
       shipping.package_requirements
       */
       String expand = "kit_definition,options,shipping,tax,variations"; // just some random ones. contact us if you're unsure
       
       Integer parentCategoryId = null;
       String parentCategoryPath = null;
       String since = null;
       String sort = null;
       
       ItemsResponse apiResponse = itemApi.getItems(parentCategoryId, parentCategoryPath, limit, offset, since,
           sort, expand, false);
       
       if (apiResponse.getItems() != null) {
           return apiResponse.getItems();
       }
       
       return new ArrayList<>();
   }
}