package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.Item;
import com.ultracart.admin.v2.models.ItemAutoOrder;
import com.ultracart.admin.v2.models.ItemResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.Arrays;
import java.util.Collections;

/*
 * Scenario: an item uses automatic enrollment (the customer is put on a fixed auto order schedule at checkout and does
 * not pick a frequency).  You want customers to be able to change the frequency of that item from MyAccount, for
 * example to Monthly, Every 2 Months, or every 30, 60 or 90 days.
 *
 * Three properties on item.auto_order control this:
 *   auto_order_myaccount_frequency_schedules       standard schedule names, e.g. "Monthly", "Every 2 Months"
 *   auto_order_myaccount_frequency_day_counts      day counts, 1 to 365, at most 20, e.g. [30, 60, 90].  10, 24, 28 and
 *                                                  45 are saved as the standard schedules "Every 10 Days" and so on.
 *   auto_order_myaccount_frequency_last_step_only  only offer the change once the item is on its last auto order step
 * Omit a property (null) to leave it unchanged.  Send an empty list to clear it.  Empty schedules and day counts turn
 * the MyAccount frequency change off for the item.
 *
 * Requirements:
 * - UltraCart support must enable "MyAccount - Advanced Auto Order Settings" on your account.  Without it, setting
 *   these properties returns a 400.
 * - The item must use automatic enrollment (auto_order.auto_order_upsell = true).  Otherwise a 400.
 * - The change is only offered to a customer when the item's auto order steps repeat forever.  An item whose steps end
 *   (for example "Monthly x5, then stop") never offers it, whatever is set here.  UltraCart checks this when the
 *   customer asks, not when you save the item.
 *
 * Expansion matters here:
 * - Read the item with _expand=auto_order.  That returns the whole auto order section, including these properties.
 * - Send that same auto_order object back.  When auto_order is present in an update, UltraCart writes every auto order
 *   setting from it, so a partial or hand-built auto_order object would reset settings you did not mean to touch.
 * - Do NOT add auto_order.steps to the expansion.  If steps are present in the update they replace the item's steps.
 *   Leaving them out leaves the steps alone.
 *
 * What the customer sees: the allowed frequencies are offered on the auto order item in MyAccount.  A change takes
 * effect after the next shipment; the next shipment date does not move.
 */
public class UpdateItemMyAccountFrequencyChange {
    public static void execute() {
        ItemApi itemApi = new ItemApi(Constants.API_KEY);

        String merchantItemId = "AUTOSHIP-30"; // change_me: an item that uses automatic enrollment
        String expand = "auto_order";          // NOT auto_order.steps, see above

        try {
            // Step 1. Read the item with its auto order section.
            ItemResponse itemResponse = itemApi.getItemByMerchantItemId(merchantItemId, expand, false);
            if (itemResponse.getError() != null) {
                System.err.println(itemResponse.getError().getDeveloperMessage());
                System.err.println(itemResponse.getError().getUserMessage());
                return;
            }
            Item item = itemResponse.getItem();
            ItemAutoOrder autoOrder = item.getAutoOrder();

            // Step 2. Make sure the item uses automatic enrollment.
            if (autoOrder == null || !Boolean.TRUE.equals(autoOrder.getAutoOrderUpsell())) {
                System.out.println("Item " + merchantItemId + " does not use automatic enrollment.  Nothing to do.");
                return;
            }

            System.out.println("Before:");
            printSettings(autoOrder);

            // Step 3. Set the frequencies a customer may switch to.  Everything else in auto_order is sent back as read.
            autoOrder.setAutoOrderMyaccountFrequencySchedules(Arrays.asList("Monthly", "Every 2 Months", "Every 3 Months"));
            autoOrder.setAutoOrderMyaccountFrequencyDayCounts(Arrays.asList(30, 60, 90));
            autoOrder.setAutoOrderMyaccountFrequencyLastStepOnly(false);

            // To turn the change off for this item instead:
            // autoOrder.setAutoOrderMyaccountFrequencySchedules(Collections.emptyList());
            // autoOrder.setAutoOrderMyaccountFrequencyDayCounts(Collections.emptyList());

            // Step 4. Save.  The same expansion returns the saved auto order section.
            ItemResponse updateResponse = itemApi.updateItem(item.getMerchantItemOid(), item, expand, false);
            if (updateResponse.getError() != null) {
                System.err.println(updateResponse.getError().getDeveloperMessage());
                System.err.println(updateResponse.getError().getUserMessage());
                return;
            }

            System.out.println("After:");
            printSettings(updateResponse.getItem().getAutoOrder());

        } catch (ApiException e) {
            // A 400 explains itself: feature not enabled on the account, item not automatic enrollment,
            // unknown schedule name, or a bad day count.
            System.err.println("An ApiException occurred. Please review the following error:");
            System.err.println(e.getCode() + " " + e.getResponseBody());
        }
    }

    private static void printSettings(ItemAutoOrder autoOrder) {
        if (autoOrder == null) {
            System.out.println("  (no auto order section)");
            return;
        }
        System.out.println("  Schedules: " + (autoOrder.getAutoOrderMyaccountFrequencySchedules() == null ? "(none)" : autoOrder.getAutoOrderMyaccountFrequencySchedules()));
        System.out.println("  Day counts: " + (autoOrder.getAutoOrderMyaccountFrequencyDayCounts() == null ? "(none)" : autoOrder.getAutoOrderMyaccountFrequencyDayCounts()));
        System.out.println("  Last step only: " + Boolean.TRUE.equals(autoOrder.getAutoOrderMyaccountFrequencyLastStepOnly()));
    }
}
