package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

public class GetOrder {
   /*
    * OrderApi.getOrder() retrieves a single order for a given order_id.
    */
   public void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       // The expansion variable instructs UltraCart how much information to return.  The order object is large and
       // while it's easily manageable for a single order, when querying thousands of orders, is useful to reduce
       // payload size.
       // see www.ultracart.com/api/ for all the expansion fields available (this list below may become stale)
       /*
       Possible Order Expansions:
       affiliate           affiliate.ledger                    auto_order
       billing             channel_partner                     checkout
       coupon              customer_profile                    digital_order
       edi                 fraud_score                         gift
       gift_certificate    internal                            item
       linked_shipment     marketing                           payment
       payment.transaction quote                               salesforce
       shipping            shipping.tracking_number_details    summary
       taxes
       */
       String expansion = "item,summary,billing,shipping,shipping.tracking_number_details";

       String orderId = "DEMO-0009104390";
       OrderResponse apiResponse = orderApi.getOrder(orderId, expansion);

       if (apiResponse.getError() != null) {
           System.err.println(apiResponse.getError().getDeveloperMessage());
           System.err.println(apiResponse.getError().getUserMessage());
           System.exit(1);
       }

       Order order = apiResponse.getOrder();
       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       System.out.println(gson.toJson(order));
   }
}