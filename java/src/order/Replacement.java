package order;

import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.OrderReplacement;
import com.ultracart.admin.v2.models.OrderReplacementItem;
import com.ultracart.admin.v2.models.OrderReplacementResponse;
import com.ultracart.admin.v2.util.ApiException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/*
* The use-case for replacement() is to create another order for a customer to replace the items of the existing
* order. For example, a merchant is selling perishable goods and the goods arrive late, spoiled. replacement()
* helps to create another order to send more goods to the customer.
*
* You MUST supply the items you desire in the replacement order. This is done with the OrderReplacement.items field.
* All options are displayed below including whether to charge the customer for this replacement order or not.
*/
public class Replacement {
   public static void execute() throws ApiException {
       OrderApi orderApi = new OrderApi(common.Constants.API_KEY);

       // Step 1. Replace the order
       String orderIdToReplace = "DEMO-0009104436";
       OrderReplacement replacementOptions = new OrderReplacement();
       replacementOptions.setOriginalOrderId(orderIdToReplace);

       List<OrderReplacementItem> items = new ArrayList<>();

       OrderReplacementItem item1 = new OrderReplacementItem();
       item1.setMerchantItemId("TSHIRT");
       item1.setQuantity(BigDecimal.valueOf(1));
       // item1.setArbitraryUnitCost(9.99);
       items.add(item1);

       OrderReplacementItem item2 = new OrderReplacementItem();
       item2.setMerchantItemId("BONE");
       item2.setQuantity(BigDecimal.valueOf(2));
       items.add(item2);

       replacementOptions.setItems(items);

       // replacementOptions.setShippingMethod("FedEx: Ground");
       replacementOptions.setImmediateCharge(true);
       replacementOptions.setSkipPayment(true);
       replacementOptions.setFree(true);
       replacementOptions.setCustomField1("Whatever");
       replacementOptions.setCustomField4("More Whatever");
       replacementOptions.setAdditionalMerchantNotesNewOrder("Replacement order for spoiled ice cream");
       replacementOptions.setAdditionalMerchantNotesOriginalOrder("This order was replaced.");

       OrderReplacementResponse apiResponse = orderApi.replacement(orderIdToReplace, replacementOptions);

       System.out.println("Replacement Order: " + apiResponse.getOrderId());
       System.out.println("Success flag: " + apiResponse.getSuccessful());
   }
}