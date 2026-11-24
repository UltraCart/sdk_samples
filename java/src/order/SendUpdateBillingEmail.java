package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.BaseResponse;
import com.ultracart.admin.v2.util.ApiException;

/*
 * OrderApi.sendUpdateBillingEmail() emails the customer a link to update their billing information on an order
 * that is in Accounts Receivable.  It is the API version of the "Send Billing Update" button on the
 * Accounts Receivable Process Payment screen.  The email goes out within a minute.
 *
 * While the order is less than 7 days old, UltraCart sends a reminder every 2 days after this email.
 *
 * The call is refused (HTTP 400, thrown as an ApiException) when:
 * - the order is not in Accounts Receivable
 * - the order does not have a valid email address
 * - the update billing email is turned off for the account
 * - a StoreFront communication flow handles unprocessed payments for the order (the flow emails the customer instead)
 * - this method already sent the email for the order in the last 24 hours
 *
 * Requires SDK 4.1.260 or later.
 */
public class SendUpdateBillingEmail {
    public static void execute() {
        OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

        String orderId = "DEMO-0009104436";

        try {
            BaseResponse apiResponse = orderApi.sendUpdateBillingEmail(orderId);

            if (apiResponse.getError() != null) {
                System.err.println(apiResponse.getError().getDeveloperMessage());
                System.err.println(apiResponse.getError().getUserMessage());
                return;
            }

            if (Boolean.TRUE.equals(apiResponse.getSuccess())) {
                System.out.println("Update billing email was queued.");
            }
        } catch (ApiException e) {
            // The reason for a refusal is in the response body.
            System.out.println("An ApiException occurred.  Please review the following error:");
            System.out.println(e.getCode() + " " + e.getResponseBody());
        }
    }
}
