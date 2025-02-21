package order;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import java.util.List;

public class GetOrderEdiDocuments {
   /*
       getOrderEdiDocuments returns back all EDI documents associated with an order.

       Possible Errors:
       Order.channelPartnerOid is null -> "Order is not associated with an EDI channel partner."
    */
   public void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String orderId = "DEMO-0009104976";
       OrderEdiDocumentsResponse response = orderApi.getOrderEdiDocuments(orderId);
       List<OrderEdiDocument> documents = response.getEdiDocuments();

       Gson gson = new GsonBuilder().setPrettyPrinting().create();
       for (OrderEdiDocument doc : documents) {
           System.out.println(gson.toJson(doc));
       }
   }
}