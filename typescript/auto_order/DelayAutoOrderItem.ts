import { autoOrderApi } from '../api';
import {
    AutoOrder,
    AutoOrderItem,
} from 'ultracart_rest_api_v2_typescript';

/**
 * DelayAutoOrderItem
 *
 * Delay one item's next shipment in an auto-order by N days.
 *
 * Fetch with expansion, mutate, persist. UltraCart does not support PATCH.
 *
 * This is the canonical pattern for editing an auto-order item in UltraCart:
 *
 *   1. GET the auto-order with the `items` expansion.
 *   2. Mutate the target item IN PLACE on the object returned by GET.
 *   3. PUT the full auto-order back.
 *   4. Re-GET and verify the change actually persisted.
 *
 * UltraCart does NOT support PATCH on auto-orders. Sending a stripped-down
 * item object on PUT is unsafe -- fields you omit (frequency, paused,
 * arbitrary_*, options, etc.) can be lost, and updates to items in unusual
 * states (e.g. mid free-trial) may silently no-op. Always echo the full
 * item objects as returned by GET, then mutate only the field(s) you intend
 * to change.
 *
 * Typical use case: a support bot or AI agent processing
 *     "please delay my next shipment by 30 days"
 * for a specific item in a multi-item auto-order.
 */
export class DelayAutoOrderItem {
    // Sample values. In a real integration these would come from the customer
    // support request or AI agent context.
    private static readonly REFERENCE_ORDER_ID = 'DEMO-0009103116'; // UltraCart order id that placed the auto-order
    private static readonly ITEM_ID            = 'ITEM001';         // the original_item_id you want to delay
    private static readonly DELAY_DAYS         = 30;

    // DO_WORK defaults to false (dry run). Flip to true to actually persist.
    private static readonly DO_WORK = false;

    // How many days before the new shipment date to set the preshipment notice.
    private static readonly PRESHIPMENT_NOTICE_LEAD_DAYS = 3;
    private static readonly MS_PER_DAY = 24 * 60 * 60 * 1000;

    public static async execute(): Promise<void> {
        console.log(`--- ${this.name} ---`);

        const expand = 'items';

        try {
            // 1. Fetch the full auto-order with items expansion. We need every field on
            //    every item so we can PUT them back unchanged.
            //
            //    Alternative lookup: if you have the auto_order_code instead of the
            //    reference order id, use autoOrderApi.getAutoOrderByCode({autoOrderCode, expand}).
            const getResponse = await autoOrderApi.getAutoOrderByReferenceOrderId({
                referenceOrderId: this.REFERENCE_ORDER_ID,
                expand,
            });
            const autoOrder = getResponse.auto_order as AutoOrder | undefined;
            if (!autoOrder) {
                console.error(`ERROR: No auto-order found for reference order ${this.REFERENCE_ORDER_ID}.`);
                return;
            }

            const target = DelayAutoOrderItem.findItem(autoOrder, this.ITEM_ID);
            if (!target) {
                console.error(`ERROR: Item ${this.ITEM_ID} not found in auto-order for ${this.REFERENCE_ORDER_ID}.`);
                return;
            }

            const currentDtsStr = target.next_shipment_dts;
            if (!currentDtsStr) {
                console.error(`ERROR: Item ${this.ITEM_ID} has no next_shipment_dts; nothing to delay.`);
                return;
            }

            const currentDts = new Date(currentDtsStr);
            if (isNaN(currentDts.getTime())) {
                console.error(`ERROR: Could not parse next_shipment_dts "${currentDtsStr}".`);
                return;
            }
            const now = new Date();

            // 2. Compute the new dates. If the stored next_shipment_dts is in the past
            //    (which can happen for items mid-cycle or post-trial), anchoring the
            //    delay to that stale date would leave the customer with a near-term
            //    shipment, not the delay they asked for. Anchor to whichever is later:
            //    the stored date, or now.
            const anchor = currentDts.getTime() > now.getTime() ? currentDts : now;
            const newShipmentDts = new Date(anchor.getTime() + this.DELAY_DAYS * this.MS_PER_DAY);
            const newNoticeDts   = new Date(newShipmentDts.getTime()
                                            - this.PRESHIPMENT_NOTICE_LEAD_DAYS * this.MS_PER_DAY);

            if (newNoticeDts.getTime() <= now.getTime()) {
                console.error(`ERROR: Computed preshipment notice ${DelayAutoOrderItem.isoFmt(newNoticeDts)} is not in the future.`);
                return;
            }

            // 3. Mutate the target item IN PLACE. Do not rebuild the items array.
            //    Every other field on the item (and every other item in the auto-order)
            //    is preserved exactly as UltraCart returned it.
            const newShipmentIso = DelayAutoOrderItem.isoFmt(newShipmentDts);
            const newNoticeIso   = DelayAutoOrderItem.isoFmt(newNoticeDts);
            target.next_shipment_dts          = newShipmentIso;
            target.next_preshipment_notice_dts = newNoticeIso;

            console.log('-'.repeat(60));
            console.log(`Reference order:      ${this.REFERENCE_ORDER_ID}`);
            console.log(`Item:                 ${this.ITEM_ID}`);
            console.log(`Current next ship:    ${currentDtsStr}`);
            console.log(`Proposed next ship:   ${newShipmentIso}`);
            console.log(`Proposed notice:      ${newNoticeIso}`);
            if (currentDts.getTime() < now.getTime()) {
                console.log('Note: stored next_shipment_dts was in the past; anchored delay to today.');
            }
            console.log('-'.repeat(60));

            if (!this.DO_WORK) {
                console.log('DRY RUN -- no changes persisted. Set DO_WORK = true to apply.');
                return;
            }

            // 4. PUT the full auto-order back.
            //    "No" for validateOriginalOrder skips re-validation of the original order;
            //    an item-level date edit doesn't need it.
            const autoOrderOid = autoOrder.auto_order_oid as number;
            const putResponse = await autoOrderApi.updateAutoOrder({
                autoOrderOid,
                autoOrder,
                validateOriginalOrder: 'No',
                expand,
            });
            const putItem = DelayAutoOrderItem.findItem(putResponse.auto_order as AutoOrder | undefined, this.ITEM_ID);
            console.log(`PUT response next_shipment_dts: ${putItem ? putItem.next_shipment_dts : '(item not in response)'}`);

            // 5. Re-GET and verify the change actually persisted. UltraCart can echo a
            //    value back in the PUT response without it sticking for items in
            //    unusual states. A fresh GET is the only way to know for sure.
            const verifyResponse = await autoOrderApi.getAutoOrderByReferenceOrderId({
                referenceOrderId: this.REFERENCE_ORDER_ID,
                expand,
            });
            const verifyItem = DelayAutoOrderItem.findItem(verifyResponse.auto_order as AutoOrder | undefined, this.ITEM_ID);
            const verifiedDtsStr = verifyItem ? verifyItem.next_shipment_dts : undefined;

            if (verifiedDtsStr && new Date(verifiedDtsStr).getTime() === newShipmentDts.getTime()) {
                console.log(`VERIFIED: next_shipment_dts persisted as ${verifiedDtsStr}`);
                return;
            }

            console.warn(`WARNING: Re-GET shows next_shipment_dts = ${verifiedDtsStr}, expected ${newShipmentIso}.`);
            console.warn('The PUT was accepted by UltraCart but the value did not stick on re-read.');
            console.warn('This commonly indicates the item is in a state UltraCart manages '
                + 'automatically (e.g. mid free-trial). Escalate for human review.');
        } catch (ex) {
            console.error(`Error: ${ex instanceof Error ? ex.message : 'Unknown error'}`);
            console.error(ex instanceof Error ? ex.stack : ex);
        }
    }

    private static findItem(autoOrder: AutoOrder | undefined, itemId: string): AutoOrderItem | undefined {
        if (!autoOrder) return undefined;
        for (const item of autoOrder.items || []) {
            if (item.original_item_id === itemId) {
                return item;
            }
        }
        return undefined;
    }

    /**
     * Format a Date as UltraCart-style ISO 8601 with milliseconds in local time
     * with a numeric timezone offset (e.g. 2026-06-18T09:15:00.000-04:00).
     *
     * Date#toISOString() always emits UTC with 'Z'; the Python reference emits
     * a local offset, which is what the API returns on GET.
     */
    private static isoFmt(dt: Date): string {
        const pad2 = (n: number) => String(n).padStart(2, '0');
        const pad3 = (n: number) => String(n).padStart(3, '0');

        const year    = dt.getFullYear();
        const month   = pad2(dt.getMonth() + 1);
        const day     = pad2(dt.getDate());
        const hours   = pad2(dt.getHours());
        const minutes = pad2(dt.getMinutes());
        const seconds = pad2(dt.getSeconds());
        const millis  = pad3(dt.getMilliseconds());

        const offsetMin = -dt.getTimezoneOffset();
        const sign      = offsetMin >= 0 ? '+' : '-';
        const offsetAbs = Math.abs(offsetMin);
        const offH      = pad2(Math.floor(offsetAbs / 60));
        const offM      = pad2(offsetAbs % 60);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}${sign}${offH}:${offM}`;
    }
}

// Example of how to call the method
// DelayAutoOrderItem.execute().catch(console.error);
