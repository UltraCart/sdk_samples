package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class IsRefundableOrder {
    /*
        isRefundable queries the UltraCart system whether an order is refundable or not.
        In addition to a simple boolean response, UltraCart also returns back any reasons why
        an order is not refundable.
        Finally, the response also contains any refund or return reasons configured on the account in the event
        that this merchant account is configured to require a reason for a return or refund.
     */
    public static void execute() throws ApiException {
        OrderApi orderApi = new OrderApi(Constants.API_KEY);

        String orderId = "DEMO-0009104976";
        OrderRefundableResponse refundableResponse = orderApi.isRefundableOrder(orderId);
        System.out.println("Is Refundable: " + refundableResponse.getRefundable());

        // the response contains dropdown values and additional information.  It's much more than a true/false flag.
        System.out.println("API Response:");
        System.out.println(refundableResponse.toString());
    }
}