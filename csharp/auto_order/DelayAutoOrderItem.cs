using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.auto_order
{
    /// <summary>
    /// DelayAutoOrderItem
    ///
    /// Delay one item's next shipment in an auto-order by N days.
    ///
    /// Fetch with expansion, mutate, persist. UltraCart does not support PATCH.
    ///
    /// This is the canonical pattern for editing an auto-order item in UltraCart:
    ///
    ///   1. GET the auto-order with the `items` expansion.
    ///   2. Mutate the target item IN PLACE on the object returned by GET.
    ///   3. PUT the full auto-order back.
    ///   4. Re-GET and verify the change actually persisted.
    ///
    /// UltraCart does NOT support PATCH on auto-orders. Sending a stripped-down
    /// item object on PUT is unsafe -- fields you omit (frequency, paused,
    /// arbitrary_*, options, etc.) can be lost, and updates to items in unusual
    /// states (e.g. mid free-trial) may silently no-op. Always echo the full
    /// item objects as returned by GET, then mutate only the field(s) you intend
    /// to change.
    ///
    /// Typical use case: a support bot or AI agent processing
    ///     "please delay my next shipment by 30 days"
    /// for a specific item in a multi-item auto-order.
    /// </summary>
    public class DelayAutoOrderItem
    {
        // Sample values. In a real integration these would come from the
        // customer support request or AI agent context.
        private const string ReferenceOrderId = "DEMO-0009103116"; // UltraCart order id that placed the auto-order
        private const string ItemId           = "ITEM001";         // the original_item_id you want to delay
        private const int    DelayDays        = 30;

        // DoWork defaults to false (dry run). Flip to true to actually persist.
        private const bool DoWork = false;

        // How many days before the new shipment date to set the preshipment notice.
        private const int PreshipmentNoticeLeadDays = 3;

        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");

            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

            // We need every field on every item so we can PUT them back unchanged.
            string expand = "items";

            // 1. Fetch the full auto-order with items expansion.
            //
            //    Alternative lookup: if you have the auto_order_code instead of the
            //    reference order id, use:
            //        autoOrderApi.GetAutoOrderByCode(autoOrderCode, expand);
            AutoOrderResponse getResponse = autoOrderApi.GetAutoOrderByReferenceOrderId(ReferenceOrderId, expand);
            AutoOrder autoOrder = getResponse.AutoOrder;
            if (autoOrder == null)
            {
                Console.Error.WriteLine($"ERROR: No auto-order found for reference order {ReferenceOrderId}.");
                return;
            }

            AutoOrderItem target = FindItem(autoOrder, ItemId);
            if (target == null)
            {
                Console.Error.WriteLine($"ERROR: Item {ItemId} not found in auto-order for {ReferenceOrderId}.");
                return;
            }

            string currentDtsStr = target.NextShipmentDts;
            if (string.IsNullOrEmpty(currentDtsStr))
            {
                Console.Error.WriteLine($"ERROR: Item {ItemId} has no next_shipment_dts; nothing to delay.");
                return;
            }

            DateTimeOffset currentDts = DateTimeOffset.Parse(
                currentDtsStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
            DateTimeOffset now = DateTimeOffset.Now.ToOffset(currentDts.Offset);

            // 2. Compute the new dates. If the stored next_shipment_dts is in the past
            //    (which can happen for items mid-cycle or post-trial), anchoring the
            //    delay to that stale date would leave the customer with a near-term
            //    shipment, not the delay they asked for. Anchor to whichever is later:
            //    the stored date, or now.
            DateTimeOffset anchor = currentDts > now ? currentDts : now;
            DateTimeOffset newShipmentDts = anchor.AddDays(DelayDays);
            DateTimeOffset newNoticeDts   = newShipmentDts.AddDays(-PreshipmentNoticeLeadDays);

            if (newNoticeDts <= now)
            {
                Console.Error.WriteLine(
                    $"ERROR: Computed preshipment notice {IsoFmt(newNoticeDts)} is not in the future.");
                return;
            }

            // 3. Mutate the target item IN PLACE. Do not rebuild the items array.
            //    Every other field on the item (and every other item in the auto-order)
            //    is preserved exactly as UltraCart returned it.
            string newShipmentIso = IsoFmt(newShipmentDts);
            string newNoticeIso   = IsoFmt(newNoticeDts);
            target.NextShipmentDts          = newShipmentIso;
            target.NextPreshipmentNoticeDts = newNoticeIso;

            Console.WriteLine(new string('-', 60));
            Console.WriteLine($"Reference order:      {ReferenceOrderId}");
            Console.WriteLine($"Item:                 {ItemId}");
            Console.WriteLine($"Current next ship:    {currentDtsStr}");
            Console.WriteLine($"Proposed next ship:   {newShipmentIso}");
            Console.WriteLine($"Proposed notice:      {newNoticeIso}");
            if (currentDts < now)
            {
                Console.WriteLine("Note: stored next_shipment_dts was in the past; anchored delay to today.");
            }
            Console.WriteLine(new string('-', 60));

            if (!DoWork)
            {
                Console.WriteLine("DRY RUN -- no changes persisted. Set DoWork = true to apply.");
                return;
            }

            // 4. PUT the full auto-order back.
            //    The C# SDK's UpdateAutoOrder takes (oid, autoOrder, validateOriginalOrder, expand).
            //    "No" skips re-validation of the original order; an item-level date edit
            //    doesn't need it.
            string validateOriginalOrder = "No";
            int autoOrderOid = autoOrder.AutoOrderOid;
            AutoOrderResponse putResponse = autoOrderApi.UpdateAutoOrder(
                autoOrderOid, autoOrder, validateOriginalOrder, expand);
            AutoOrderItem putItem = FindItem(putResponse.AutoOrder, ItemId);
            Console.WriteLine($"PUT response next_shipment_dts: {putItem?.NextShipmentDts}");

            // 5. Re-GET and verify the change actually persisted. UltraCart can echo a
            //    value back in the PUT response without it sticking for items in
            //    unusual states. A fresh GET is the only way to know for sure.
            AutoOrderResponse verifyResponse = autoOrderApi.GetAutoOrderByReferenceOrderId(ReferenceOrderId, expand);
            AutoOrderItem verifyItem = FindItem(verifyResponse.AutoOrder, ItemId);
            string verifiedDtsStr = verifyItem?.NextShipmentDts;

            if (!string.IsNullOrEmpty(verifiedDtsStr)
                && DateTimeOffset.TryParse(verifiedDtsStr, CultureInfo.InvariantCulture,
                       DateTimeStyles.RoundtripKind, out DateTimeOffset verifiedDts)
                && verifiedDts == newShipmentDts)
            {
                Console.WriteLine($"VERIFIED: next_shipment_dts persisted as {verifiedDtsStr}");
                return;
            }

            Console.WriteLine(
                $"WARNING: Re-GET shows next_shipment_dts = {verifiedDtsStr}, expected {newShipmentIso}.");
            Console.WriteLine("The PUT was accepted by UltraCart but the value did not stick on re-read.");
            Console.WriteLine("This commonly indicates the item is in a state UltraCart manages "
                              + "automatically (e.g. mid free-trial). Escalate for human review.");
        }

        /// <summary>
        /// Return the item with the given OriginalItemId, or null.
        /// </summary>
        private static AutoOrderItem FindItem(AutoOrder autoOrder, string itemId)
        {
            if (autoOrder == null) return null;
            foreach (AutoOrderItem item in autoOrder.Items ?? new List<AutoOrderItem>())
            {
                if (string.Equals(item.OriginalItemId, itemId, StringComparison.Ordinal))
                {
                    return item;
                }
            }
            return null;
        }

        /// <summary>
        /// Format a DateTimeOffset as UltraCart-style ISO 8601 with milliseconds and offset.
        /// </summary>
        private static string IsoFmt(DateTimeOffset dt)
        {
            return dt.ToString("yyyy-MM-ddTHH:mm:ss.fffzzz", CultureInfo.InvariantCulture);
        }
    }
}
