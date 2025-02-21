package item;

import com.ultracart.admin.v2.CustomerApi;
import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.math.BigDecimal;
import java.util.List;

public class GetItem {
   public static void execute() {
       try {
           ItemApi itemApi = new ItemApi(Constants.API_KEY);
           int itemOid = ItemFunctions.insertSampleItemAndGetOid();
           CustomerApi customerApi = new CustomerApi(Constants.API_KEY);

           String itemId = itemApi.getItem(itemOid, null, false).getItem().getMerchantItemId();
           
           ItemResponse apiResponse = itemApi.getItemByMerchantItemId(itemId, null, false);
           Item item = apiResponse.getItem();

           int merchantItemOid = item.getMerchantItemOid();

           String expand = "reviews,reviews.individual_reviews";
           apiResponse = itemApi.getItem(merchantItemOid, expand, false);
           item = apiResponse.getItem();

           ItemReviews itemReviews = item.getReviews();
           List<ItemReview> individualReviews = itemReviews.getIndividualReviews();
           
           for (ItemReview individualReview : individualReviews) {
               String ratingName1 = individualReview.getRatingName1();
               BigDecimal ratingScore1 = individualReview.getRatingScore1();

               CustomerResponse customerResponse = customerApi.getCustomer(individualReview.getCustomerProfileOid(), "reviewer");
               Customer customer = customerResponse.getCustomer();
               CustomerReviewer reviewer = customer.getReviewer();
           }

           System.out.println("The following item was retrieved via getItem():");
           System.out.println(item.toString());

           ItemFunctions.deleteSampleItemByOid(itemOid);
       } catch (ApiException e) {
           System.out.println("An ApiException occurred. Please review the following error:");
           e.printStackTrace();
           System.exit(1);
       }
   }
}