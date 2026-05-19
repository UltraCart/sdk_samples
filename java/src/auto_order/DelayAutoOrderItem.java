package auto_order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.List;

/**
 * Delay one item's next shipment in an auto-order by N days.
 *
 * Fetch with expansion, mutate, persist. UltraCart does NOT support PATCH.
 *
 * This is the canonical pattern for editing an auto-order item in UltraCart:
 *
 *     1. GET the auto-order with the `items` expansion.
 *     2. Mutate the target item IN PLACE on the object returned by GET.
 *     3. PUT the full auto-order back.
 *     4. Re-GET and verify the change actually persisted.
 *
 * Sending a stripped-down item object on PUT is unsafe -- fields you omit
 * (frequency, paused, arbitrary_*, options, etc.) can be lost, and updates to
 * items in unusual states (e.g. mid free-trial) may silently no-op. Always
 * echo the full item objects as returned by GET, then mutate only the
 * field(s) you intend to change.
 *
 * Typical use case: a support bot or AI agent processing
 *     "please delay my next shipment by 30 days"
 * for a specific item in a multi-item auto-order.
 */
public class DelayAutoOrderItem {

    // Sample values. In a real integration these would come from the customer
    // support request or AI agent context.
    private static final String REFERENCE_ORDER_ID = "DEMO-0009103116"; // UltraCart order id that placed the auto-order
    private static final String ITEM_ID            = "ITEM001";         // the original_item_id you want to delay
    private static final int    DELAY_DAYS         = 30;

    // DRY_RUN defaults to true. Set to false to actually persist the change.
    private static final boolean DRY_RUN = true;

    // How many days before the new shipment date to set the preshipment notice.
    private static final int PRESHIPMENT_NOTICE_LEAD_DAYS = 3;

    // ISO 8601 with millisecond precision and offset, matching the format
    // UltraCart returns on GET (e.g. 2026-05-19T10:30:00.123-04:00).
    private static final DateTimeFormatter ISO_MILLIS = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
            .appendFraction(ChronoField.MILLI_OF_SECOND, 3, 3, true)
            .appendOffset("+HH:MM", "+00:00")
            .toFormatter();

    public static void execute() {
        System.out.println("--- " + DelayAutoOrderItem.class.getSimpleName() + " ---");

        AutoOrderApi autoOrderApi = new AutoOrderApi(common.Constants.API_KEY);
        String expand = "items"; // see https://www.ultracart.com/api/#resource_auto_order.html for list

        try {
            // 1. Fetch the full auto-order with items expansion. We need every field on
            //    every item so we can PUT them back unchanged.
            //
            //    Alternative lookup: if you have the auto_order_code instead of the
            //    reference order id, use:
            //        autoOrderApi.getAutoOrderByCode(autoOrderCode, expand);
            AutoOrderResponse getResponse = autoOrderApi.getAutoOrderByReferenceOrderId(REFERENCE_ORDER_ID, expand);
            AutoOrder autoOrder = getResponse.getAutoOrder();
            if (autoOrder == null) {
                System.err.println("ERROR: No auto-order found for reference order " + REFERENCE_ORDER_ID + ".");
                return;
            }

            AutoOrderItem target = findItem(autoOrder, ITEM_ID);
            if (target == null) {
                System.err.println("ERROR: Item " + ITEM_ID + " not found in auto-order for " + REFERENCE_ORDER_ID + ".");
                return;
            }

            String currentDtsStr = target.getNextShipmentDts();
            if (currentDtsStr == null || currentDtsStr.isEmpty()) {
                System.err.println("ERROR: Item " + ITEM_ID + " has no next_shipment_dts; nothing to delay.");
                return;
            }

            OffsetDateTime currentDts = OffsetDateTime.parse(currentDtsStr);
            OffsetDateTime now = OffsetDateTime.now(ZoneId.systemDefault())
                                               .withOffsetSameInstant(currentDts.getOffset());

            // 2. Compute the new dates. If the stored next_shipment_dts is in the past
            //    (which can happen for items mid-cycle or post-trial), anchoring the
            //    delay to that stale date would leave the customer with a near-term
            //    shipment, not the delay they asked for. Anchor to whichever is later:
            //    the stored date, or now.
            OffsetDateTime anchor = currentDts.isAfter(now) ? currentDts : now;
            OffsetDateTime newShipmentDts = anchor.plusDays(DELAY_DAYS);
            OffsetDateTime newNoticeDts   = newShipmentDts.minusDays(PRESHIPMENT_NOTICE_LEAD_DAYS);

            if (!newNoticeDts.isAfter(now)) {
                System.err.println("ERROR: Computed preshipment notice " + ISO_MILLIS.format(newNoticeDts)
                                   + " is not in the future.");
                return;
            }

            // 3. Mutate the target item IN PLACE. Do not rebuild the items list.
            //    Every other field on the item (and every other item in the auto-order)
            //    is preserved exactly as UltraCart returned it.
            String newShipmentIso = ISO_MILLIS.format(newShipmentDts);
            String newNoticeIso   = ISO_MILLIS.format(newNoticeDts);
            target.setNextShipmentDts(newShipmentIso);
            target.setNextPreshipmentNoticeDts(newNoticeIso);

            System.out.println("------------------------------------------------------------");
            System.out.println("Reference order:      " + REFERENCE_ORDER_ID);
            System.out.println("Item:                 " + ITEM_ID);
            System.out.println("Current next ship:    " + currentDtsStr);
            System.out.println("Proposed next ship:   " + newShipmentIso);
            System.out.println("Proposed notice:      " + newNoticeIso);
            if (currentDts.isBefore(now)) {
                System.out.println("Note: stored next_shipment_dts was in the past; anchored delay to today.");
            }
            System.out.println("------------------------------------------------------------");

            if (DRY_RUN) {
                System.out.println("DRY RUN -- no changes persisted. Set DRY_RUN = false to apply.");
                return;
            }

            // 4. PUT the full auto-order back.
            Integer autoOrderOid = autoOrder.getAutoOrderOid();
            String validateOriginalOrder = "No";
            AutoOrderResponse putResponse = autoOrderApi.updateAutoOrder(
                    autoOrderOid, autoOrder, validateOriginalOrder, expand);
            AutoOrderItem putItem = findItem(putResponse.getAutoOrder(), ITEM_ID);
            System.out.println("PUT response next_shipment_dts: "
                               + (putItem != null ? putItem.getNextShipmentDts() : "(item not in response)"));

            // 5. Re-GET and verify the change actually persisted. UltraCart can echo a
            //    value back in the PUT response without it sticking for items in
            //    unusual states. A fresh GET is the only way to know for sure.
            AutoOrderResponse verifyResponse = autoOrderApi.getAutoOrderByReferenceOrderId(REFERENCE_ORDER_ID, expand);
            AutoOrderItem verifyItem = findItem(verifyResponse.getAutoOrder(), ITEM_ID);
            String verifiedDtsStr = verifyItem != null ? verifyItem.getNextShipmentDts() : null;

            if (verifiedDtsStr != null
                    && OffsetDateTime.parse(verifiedDtsStr).isEqual(newShipmentDts)) {
                System.out.println("VERIFIED: next_shipment_dts persisted as " + verifiedDtsStr);
                return;
            }

            System.out.println("WARNING: Re-GET shows next_shipment_dts = " + verifiedDtsStr
                               + ", expected " + newShipmentIso + ".");
            System.out.println("The PUT was accepted by UltraCart but the value did not stick on re-read.");
            System.out.println("This commonly indicates the item is in a state UltraCart manages "
                               + "automatically (e.g. mid free-trial). Escalate for human review.");
        } catch (ApiException e) {
            System.err.println("Exception when calling AutoOrderApi: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /** Return the item with the given original_item_id, or null. */
    private static AutoOrderItem findItem(AutoOrder autoOrder, String itemId) {
        if (autoOrder == null) return null;
        List<AutoOrderItem> items = autoOrder.getItems();
        if (items == null) return null;
        for (AutoOrderItem item : items) {
            if (itemId.equals(item.getOriginalItemId())) {
                return item;
            }
        }
        return null;
    }
}
