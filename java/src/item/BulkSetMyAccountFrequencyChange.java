package item;

import com.ultracart.admin.v2.ItemApi;
import com.ultracart.admin.v2.models.Item;
import com.ultracart.admin.v2.models.ItemAutoOrder;
import com.ultracart.admin.v2.models.ItemResponse;
import com.ultracart.admin.v2.util.ApiException;
import common.Constants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/*
 * Scenario: you have a list of automatic enrollment items and want customers to be able to change the frequency of
 * all of them from MyAccount.  This sets the same MyAccount frequency change settings on every item in the list.
 * See UpdateItemMyAccountFrequencyChange for what the three properties mean and the requirements.
 *
 * It runs as a dry run by default: it reads each item and prints what it would change, without saving anything.
 * Check the output, then set dryRun = false.
 *
 * Expansion: each item is read with _expand=auto_order (NOT auto_order.steps) and the same auto_order object is sent
 * back with only the three MyAccount properties changed.  An update writes every auto order setting from the object
 * it is given, and replaces the steps if steps are present, so never send a hand-built or partial auto_order.
 *
 * Items are updated one at a time so each item gets its own result line.  updateItems() (items/batch) can do up to 20
 * per call, but it saves items in order and stops at the first one that fails, leaving the earlier ones saved.
 * If you get a 429 (too many requests), slow down and rerun; items already set are reported as unchanged.
 *
 * You can do the same thing without code with the Batch Item Update tool (the MyAccount Frequency Change option).
 */
public class BulkSetMyAccountFrequencyChange {
    public static void execute() {
        boolean dryRun = true; // change_me: false to save

        // change_me: the automatic enrollment items to update
        List<String> merchantItemIds = Arrays.asList("AUTOSHIP-30", "AUTOSHIP-60", "AUTOSHIP-90");

        // change_me: what customers may switch to.  Empty lists turn the change off for these items.
        List<String> schedules = Arrays.asList("Monthly", "Every 2 Months", "Every 3 Months");
        List<Integer> dayCounts = Arrays.asList(30, 60, 90);
        boolean lastStepOnly = false;

        String expand = "auto_order"; // NOT auto_order.steps

        ItemApi itemApi = new ItemApi(Constants.API_KEY);
        int updated = 0, unchanged = 0, skipped = 0, failed = 0;

        for (String merchantItemId : merchantItemIds) {
            try {
                ItemResponse itemResponse = itemApi.getItemByMerchantItemId(merchantItemId, expand, false);
                Item item = itemResponse.getItem();
                if (item == null) {
                    System.out.println(merchantItemId + ": not found, skipped");
                    skipped++;
                    continue;
                }

                ItemAutoOrder autoOrder = item.getAutoOrder();
                if (autoOrder == null || !Boolean.TRUE.equals(autoOrder.getAutoOrderUpsell())) {
                    System.out.println(merchantItemId + ": does not use automatic enrollment, skipped");
                    skipped++;
                    continue;
                }

                String before = describe(autoOrder);
                autoOrder.setAutoOrderMyaccountFrequencySchedules(new ArrayList<>(schedules));
                autoOrder.setAutoOrderMyaccountFrequencyDayCounts(new ArrayList<>(dayCounts));
                autoOrder.setAutoOrderMyaccountFrequencyLastStepOnly(lastStepOnly);
                String after = describe(autoOrder);

                if (before.equals(after)) {
                    System.out.println(merchantItemId + ": already " + after + ", unchanged");
                    unchanged++;
                    continue;
                }

                if (dryRun) {
                    System.out.println(merchantItemId + ": would change " + before + " -> " + after);
                    updated++;
                    continue;
                }

                ItemResponse updateResponse = itemApi.updateItem(item.getMerchantItemOid(), item, expand, false);
                if (updateResponse.getError() != null) {
                    System.out.println(merchantItemId + ": FAILED " + updateResponse.getError().getDeveloperMessage());
                    failed++;
                    continue;
                }
                System.out.println(merchantItemId + ": changed " + before + " -> " + describe(updateResponse.getItem().getAutoOrder()));
                updated++;

            } catch (ApiException e) {
                // A 400 explains itself: feature not enabled on the account, unknown schedule name, or a bad day count.
                System.out.println(merchantItemId + ": FAILED " + e.getCode() + " " + e.getResponseBody());
                failed++;
            }
        }

        System.out.println((dryRun ? "Dry run. Would update" : "Updated") + ": " + updated + ", unchanged: " + unchanged
            + ", skipped: " + skipped + ", failed: " + failed);
    }

    // Sorted so the comparison doesn't depend on order.  Day counts that match a standard schedule (10, 24, 28, 45)
    // come back as that schedule, so such an item reports "changed" on every run; list those as schedules instead.
    private static String describe(ItemAutoOrder autoOrder) {
        if (autoOrder == null) return "off";
        List<String> itemSchedules = autoOrder.getAutoOrderMyaccountFrequencySchedules() == null
            ? new ArrayList<>() : new ArrayList<>(autoOrder.getAutoOrderMyaccountFrequencySchedules());
        List<Integer> itemDayCounts = autoOrder.getAutoOrderMyaccountFrequencyDayCounts() == null
            ? new ArrayList<>() : new ArrayList<>(autoOrder.getAutoOrderMyaccountFrequencyDayCounts());
        Collections.sort(itemSchedules);
        Collections.sort(itemDayCounts);
        if (itemSchedules.isEmpty() && itemDayCounts.isEmpty()) return "off";
        String suffix = Boolean.TRUE.equals(autoOrder.getAutoOrderMyaccountFrequencyLastStepOnly()) ? ", last step only" : "";
        return itemSchedules + " days " + itemDayCounts + suffix;
    }
}
