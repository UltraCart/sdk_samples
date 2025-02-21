package checkout;

import com.ultracart.admin.v2.CheckoutApi;
import com.ultracart.admin.v2.models.Cart;
import com.ultracart.admin.v2.models.CartValidationRequest;
import com.ultracart.admin.v2.models.CartValidationResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

public class ValidateCart {
  public static void execute() {
        /*
            This is a checkout api method. It can be used both server side or client side. This example is a server side
            call using a Simple API Key. See the JavaScript sdk samples if you wish to see a browser key implementation.

            validateCart passes a shopping cart to UltraCart for validation.
         */

    try {
      CheckoutApi checkoutApi = new CheckoutApi(Constants.API_KEY);
      String cartId = "123456789123456789123456789123456789"; // usually this would be retrieved from a session variable or cookie.

      String expansion = "items,billing,shipping,coupons,checkout,payment,summary,taxes";
      // Possible Expansion Variables: (see https://www.ultracart.com/api/#resource_checkout.html) also see getCart() example

      Cart cart = checkoutApi.getCartByCartId(cartId, expansion).getCart();

      CartValidationRequest validationRequest = new CartValidationRequest();
      validationRequest.setCart(cart);
      // validationRequest.setChecks(null); // leave this null for all validations
      // Possible Checks
            /*
            All,Advertising Source Provided,Billing Address Provided,
            Billing Destination Restriction,Billing Phone Numbers Provided,Billing State Abbreviation Valid,Billing Validate City State Zip,
            Coupon Zip Code Restriction,Credit Card Shipping Method Conflict,Customer Profile Does Not Exist.,CVV2 Not Required,
            Electronic Check Confirm Account Number,Email confirmed,Email provided if required,Gift Message Length,Item Quantity Valid,
            Item Restrictions,Items Present,Merchant Specific Item Relationships,One per customer violations,Options Provided,
            Payment Information Validate,Payment Method Provided,Payment Method Restriction,Pricing Tier Limits,Quantity requirements met,
            Referral Code Provided,Shipping Address Provided,Shipping Destination Restriction,Shipping Method Provided,
            Shipping Needs Recalculation,Shipping State Abbreviation Valid,Shipping Validate City State Zip,Special Instructions Length,
            Tax County Specified,Valid Delivery Date,Valid Ship On Date,Auth Test Credit Card
             */

      // This method also does an update in the process, so pass in a good expansion and grab the return cart variable.
      CartValidationResponse apiResponse = checkoutApi.validateCart(validationRequest, expansion);
      cart = apiResponse.getCart();

      System.out.println("<html lang=\"en\"><body><pre>");
      System.out.println("Validation Errors:");
      if (apiResponse.getErrors() != null) {
        for (String error : apiResponse.getErrors()) {
          System.out.println(error);
        }
      }
      System.out.println(cart.toString());
      System.out.println("</pre></body></html>");

    } catch (ApiException e) {
      e.printStackTrace();
    }
  }
}