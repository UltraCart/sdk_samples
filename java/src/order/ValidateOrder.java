package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.Order;
import com.ultracart.admin.v2.models.OrderValidationRequest;
import com.ultracart.admin.v2.models.OrderValidationResponse;
import com.ultracart.admin.v2.util.ApiException;

/*
   validateOrder may be used to check for any and all validation errors that may result from an insertOrder
   or updateOrder call. Because those method are built on our existing infrastructure, some validation
   errors may not bubble up to the rest api call and instead be returned as generic "something went wrong" errors.
   This call will return detail validation issues needing correction.

   Within the ValidationRequest, you may leave the 'checks' array null to check for everything, or pass
   an array of the specific checks you desire. Here is a list of the checks:

   "Billing Address Provided"
   "Billing Destination Restriction"
   "Billing Phone Numbers Provided"
   "Billing State Abbreviation Valid"
   "Billing Validate City State Zip"
   "Email provided if required"
   "Gift Message Length"
   "Item Quantity Valid"
   "Items Present"
   "Merchant Specific Item Relationships"
   "One per customer violations"
   "Referral Code Provided"
   "Shipping Address Provided"
   "Shipping Destination Restriction"
   "Shipping Method Ignore Invalid"
   "Shipping Method Provided"
   "Shipping State Abbreviation Valid"
   "Shipping Validate City State Zip"
   "Special Instructions Length"
*/
public class ValidateOrder {
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       String expansion = "checkout"; // see the getOrder sample for expansion discussion

       String orderId = "DEMO-0009104976";
       Order order = orderApi.getOrder(orderId, expansion).getOrder();

       System.out.println(order.toString());

       // TODO: do some updates to the order.
       OrderValidationRequest validationRequest = new OrderValidationRequest();
       validationRequest.setOrder(order);
       validationRequest.setChecks(null); // leaving this null to perform all validations.

       OrderValidationResponse apiResponse = orderApi.validateOrder(validationRequest);

       System.out.println("Validation errors:");
       if (apiResponse.getErrors() != null) {
           for (String error : apiResponse.getErrors()) {
               System.out.println("- " + error);
           }
       } else {
           System.out.println("No validation errors found.");
       }

       System.out.println("\nValidation messages:");
       if (apiResponse.getMessages() != null) {
           for (String message : apiResponse.getMessages()) {
               System.out.println("- " + message);
           }
       } else {
           System.out.println("No validation messages found.");
       }
   }
}