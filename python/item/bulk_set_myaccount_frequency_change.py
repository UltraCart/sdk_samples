"""
Scenario: you have a list of automatic enrollment items and want customers to be able to change the frequency of
all of them from MyAccount.  This sets the same MyAccount frequency change settings on every item in the list.
See update_item_myaccount_frequency_change.py for what the three properties mean and the requirements.

It runs as a dry run by default: it reads each item and prints what it would change, without saving anything.
Check the output, then set dry_run = False.

Expansion: each item is read with expand='auto_order' (NOT auto_order.steps) and the same auto_order object is sent
back with only the three MyAccount properties changed.  An update writes every auto order setting from the object it
is given, and replaces the steps if steps are present, so never send a hand-built or partial auto_order.

Items are updated one at a time so each item gets its own result line.  update_items() (items/batch) can do up to 20
per call, but it saves items in order and stops at the first one that fails, leaving the earlier ones saved.
If you get a 429 (too many requests), slow down and rerun; items already set are reported as unchanged.

You can do the same thing without code with the Batch Item Update tool (the MyAccount Frequency Change option).
"""
from samples import api_client
from ultracart.apis import ItemApi
from ultracart import ApiException

dry_run = True  # change_me: False to save

# change_me: the automatic enrollment items to update
merchant_item_ids = ['AUTOSHIP-30', 'AUTOSHIP-60', 'AUTOSHIP-90']

# change_me: what customers may switch to.  Empty lists turn the change off for these items.
schedules = ['Monthly', 'Every 2 Months', 'Every 3 Months']
day_counts = [30, 60, 90]
last_step_only = False

expand = 'auto_order'  # NOT auto_order.steps


def describe(auto_order):
    # Sorted so the comparison doesn't depend on order.  Day counts that match a standard schedule (10, 24, 28, 45)
    # come back as that schedule, so such an item reports "changed" on every run; list those as schedules instead.
    if auto_order is None:
        return 'off'
    item_schedules = sorted(auto_order.get('auto_order_myaccount_frequency_schedules', []))
    item_day_counts = sorted(auto_order.get('auto_order_myaccount_frequency_day_counts', []))
    if not item_schedules and not item_day_counts:
        return 'off'
    suffix = ', last step only' if auto_order.get('auto_order_myaccount_frequency_last_step_only') else ''
    return f"[{', '.join(item_schedules)}] days [{', '.join(str(d) for d in item_day_counts)}]{suffix}"


item_api = ItemApi(api_client())
updated = unchanged = skipped = failed = 0

for merchant_item_id in merchant_item_ids:
    try:
        item_response = item_api.get_item_by_merchant_item_id(merchant_item_id, expand=expand, placeholders=False)
        item = item_response.get('item')
        if item is None:
            print(f'{merchant_item_id}: not found, skipped')
            skipped += 1
            continue

        auto_order = item.get('auto_order')
        if auto_order is None or not auto_order.get('auto_order_upsell'):
            print(f'{merchant_item_id}: does not use automatic enrollment, skipped')
            skipped += 1
            continue

        before = describe(auto_order)
        auto_order.auto_order_myaccount_frequency_schedules = schedules
        auto_order.auto_order_myaccount_frequency_day_counts = day_counts
        auto_order.auto_order_myaccount_frequency_last_step_only = last_step_only
        after = describe(auto_order)

        if before == after:
            print(f'{merchant_item_id}: already {after}, unchanged')
            unchanged += 1
            continue

        if dry_run:
            print(f'{merchant_item_id}: would change {before} -> {after}')
            updated += 1
            continue

        update_response = item_api.update_item(item.merchant_item_oid, item, expand=expand, placeholders=False)
        print(f"{merchant_item_id}: changed {before} -> {describe(update_response.item.get('auto_order'))}")
        updated += 1

    except ApiException as e:
        # A 400 explains itself: feature not enabled on the account, unknown schedule name, or a bad day count.
        print(f'{merchant_item_id}: FAILED {e.status} {e.body}')
        failed += 1

label = 'Dry run. Would update' if dry_run else 'Updated'
print(f'{label}: {updated}, unchanged: {unchanged}, skipped: {skipped}, failed: {failed}')
