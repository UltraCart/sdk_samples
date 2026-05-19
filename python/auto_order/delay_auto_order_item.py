"""
Delay one item's next shipment in an auto-order by N days.

Fetch with expansion, mutate, persist. UltraCart does not support PATCH.

This is the canonical pattern for editing an auto-order item in UltraCart:

    1. GET the auto-order with the `items` expansion.
    2. Mutate the target item IN PLACE on the object returned by GET.
    3. PUT the full auto-order back.
    4. Re-GET and verify the change actually persisted.

UltraCart does NOT support PATCH on auto-orders. Sending a stripped-down item
object on PUT is unsafe -- fields you omit (frequency, paused, arbitrary_*,
options, etc.) can be lost, and updates to items in unusual states (e.g.
mid free-trial) may silently no-op. Always echo the full item objects as
returned by GET, then mutate only the field(s) you intend to change.

Typical use case: a support bot or AI agent processing
    "please delay my next shipment by 30 days"
for a specific item in a multi-item auto-order.
"""

from datetime import datetime, timedelta

from ultracart.apis import AutoOrderApi
from samples import api_client


# Sample values. In a real integration these would come from the customer
# support request or AI agent context.
REFERENCE_ORDER_ID = "DEMO-0009103116"   # UltraCart order id that placed the auto-order
ITEM_ID            = "ITEM001"           # the original_item_id you want to delay
DELAY_DAYS         = 30

# DO_WORK defaults to False (dry run). Flip to True to actually persist.
DO_WORK = False

# How many days before the new shipment date to set the preshipment notice.
PRESHIPMENT_NOTICE_LEAD_DAYS = 3


def delay_auto_order_item():
    auto_order_api = AutoOrderApi(api_client())

    # 1. Fetch the full auto-order with items expansion. We need every field on
    #    every item so we can PUT them back unchanged.
    #
    #    Alternative lookup: if you have the auto_order_code instead of the
    #    original order id, use:
    #        auto_order_api.get_auto_order_by_code(auto_order_code, expand=expand)
    expand = "items"
    response = auto_order_api.get_auto_order_by_reference_order_id(
        REFERENCE_ORDER_ID, expand=expand)
    auto_order = response.auto_order
    if auto_order is None:
        print(f"ERROR: No auto-order found for reference order {REFERENCE_ORDER_ID}.")
        return

    target = _find_item(auto_order, ITEM_ID)
    if target is None:
        print(f"ERROR: Item {ITEM_ID} not found in auto-order for {REFERENCE_ORDER_ID}.")
        return

    current_dts_str = target.next_shipment_dts
    if not current_dts_str:
        print(f"ERROR: Item {ITEM_ID} has no next_shipment_dts; nothing to delay.")
        return

    current_dts = datetime.fromisoformat(current_dts_str)
    now = datetime.now(current_dts.tzinfo)

    # 2. Compute the new dates. If the stored next_shipment_dts is in the past
    #    (which can happen for items mid-cycle or post-trial), anchoring the
    #    delay to that stale date would leave the customer with a near-term
    #    shipment, not the delay they asked for. Anchor to whichever is later:
    #    the stored date, or now.
    anchor = max(current_dts, now)
    new_shipment_dts = anchor + timedelta(days=DELAY_DAYS)
    new_notice_dts = new_shipment_dts - timedelta(days=PRESHIPMENT_NOTICE_LEAD_DAYS)

    if new_notice_dts <= now:
        print(f"ERROR: Computed preshipment notice {_isofmt(new_notice_dts)} is not in the future.")
        return

    # 3. Mutate the target item IN PLACE. Do not rebuild the items array.
    #    Every other field on the item (and every other item in the auto-order)
    #    is preserved exactly as UltraCart returned it.
    new_shipment_iso = _isofmt(new_shipment_dts)
    new_notice_iso = _isofmt(new_notice_dts)
    target.next_shipment_dts = new_shipment_iso
    target.next_preshipment_notice_dts = new_notice_iso

    print("-" * 60)
    print(f"Reference order:      {REFERENCE_ORDER_ID}")
    print(f"Item:                 {ITEM_ID}")
    print(f"Current next ship:    {current_dts_str}")
    print(f"Proposed next ship:   {new_shipment_iso}")
    print(f"Proposed notice:      {new_notice_iso}")
    if current_dts < now:
        print("Note: stored next_shipment_dts was in the past; anchored delay to today.")
    print("-" * 60)

    if not DO_WORK:
        print("DRY RUN -- no changes persisted. Set DO_WORK = True to apply.")
        return

    # 4. PUT the full auto-order back.
    put_response = auto_order_api.update_auto_order(
        auto_order.auto_order_oid, auto_order, expand=expand)
    put_item = _find_item(put_response.auto_order, ITEM_ID)
    print(f"PUT response next_shipment_dts: "
          f"{put_item.next_shipment_dts if put_item else '(item not in response)'}")

    # 5. Re-GET and verify the change actually persisted. UltraCart can echo a
    #    value back in the PUT response without it sticking for items in
    #    unusual states. A fresh GET is the only way to know for sure.
    verify_response = auto_order_api.get_auto_order_by_reference_order_id(
        REFERENCE_ORDER_ID, expand=expand)
    verify_item = _find_item(verify_response.auto_order, ITEM_ID)
    verified_dts_str = verify_item.next_shipment_dts if verify_item else None

    if verified_dts_str and datetime.fromisoformat(verified_dts_str) == new_shipment_dts:
        print(f"VERIFIED: next_shipment_dts persisted as {verified_dts_str}")
        return

    print(f"WARNING: Re-GET shows next_shipment_dts = {verified_dts_str}, "
          f"expected {new_shipment_iso}.")
    print("The PUT was accepted by UltraCart but the value did not stick on re-read.")
    print("This commonly indicates the item is in a state UltraCart manages "
          "automatically (e.g. mid free-trial). Escalate for human review.")


def _find_item(auto_order, item_id):
    """Return the item whose original_item_id matches, or None."""
    if auto_order is None:
        return None
    for item in auto_order.items or []:
        if item.original_item_id == item_id:
            return item
    return None


def _isofmt(dt):
    """Format a datetime as UltraCart-style ISO 8601 with milliseconds."""
    return dt.astimezone().isoformat("T", "milliseconds")


if __name__ == "__main__":
    delay_auto_order_item()
