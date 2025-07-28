package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class UnblockRefundOnOrder {
  /**
   * unblockRefundOnOrder removes an order property that is considered when a refund request is made.
   * If the property is present, the refund is denied.  Being an order property allows for querying
   * upon it within BigQuery for audit purposes.
   */
  public static void execute() throws ApiException {
    OrderApi orderApi = new OrderApi(Constants.API_KEY);

    String orderId = "DEMO-0009105222";
    orderApi.unblockRefundOnOrder(orderId);
    System.out.println("Method executed successfully.  Returns back 204 No Content.");
  }
}