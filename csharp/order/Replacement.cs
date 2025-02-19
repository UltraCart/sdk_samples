using System;
using System.Collections.Generic;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    public class Replacement
    {
        /*
         * The use-case for replacement() is to create another order for a customer to replace the items of the existing
         * order. For example, a merchant is selling perishable goods and the goods arrive late, spoiled. replacement()
         * helps to create another order to send more goods to the customer.
         *
         * You MUST supply the items you desire in the replacement order. This is done with the OrderReplacement.items field.
         * All options are displayed below including whether to charge the customer for this replacement order or not.
         */
        public static void Execute()
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);

            // Step 1. Replace the order
            string orderIdToReplace = "DEMO-0009104436";
            OrderReplacement replacementOptions = new OrderReplacement();
            replacementOptions.OriginalOrderId = orderIdToReplace;

            List<OrderReplacementItem> items = new List<OrderReplacementItem>();

            OrderReplacementItem item1 = new OrderReplacementItem();
            item1.MerchantItemId = "TSHIRT";
            item1.Quantity = 1;
            // item1.ArbitraryUnitCost = 9.99m;
            items.Add(item1);

            OrderReplacementItem item2 = new OrderReplacementItem();
            item2.MerchantItemId = "BONE";
            item2.Quantity = 2;
            items.Add(item2);

            replacementOptions.Items = items;

            // replacementOptions.ShippingMethod = "FedEx: Ground";
            replacementOptions.ImmediateCharge = true;
            replacementOptions.SkipPayment = true;
            replacementOptions.Free = true;
            replacementOptions.CustomField1 = "Whatever";
            replacementOptions.CustomField4 = "More Whatever";
            replacementOptions.AdditionalMerchantNotesNewOrder = "Replacement order for spoiled ice cream";
            replacementOptions.AdditionalMerchantNotesOriginalOrder = "This order was replaced.";

            OrderReplacementResponse apiResponse = orderApi.Replacement(orderIdToReplace, replacementOptions);

            Console.WriteLine($"Replacement Order: {apiResponse.OrderId}");
            Console.WriteLine($"Success flag: {apiResponse.Successful}");
        }
    }
}