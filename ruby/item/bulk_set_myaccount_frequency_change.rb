require 'ultracart_api'
require_relative '../constants'

# Scenario: you have a list of automatic enrollment items and want customers to be able to change the frequency of
# all of them from MyAccount.  This sets the same MyAccount frequency change settings on every item in the list.
# See update_item_myaccount_frequency_change.rb for what the three properties mean and the requirements.
#
# It runs as a dry run by default: it reads each item and prints what it would change, without saving anything.
# Check the output, then set dry_run = false.
#
# Expansion: each item is read with _expand=auto_order (NOT auto_order.steps) and the same auto_order object is sent
# back with only the three MyAccount properties changed.  An update writes every auto order setting from the object
# it is given, and replaces the steps if steps are present, so never send a hand-built or partial auto_order.
#
# Items are updated one at a time so each item gets its own result line.  update_items() (items/batch) can do up to 20
# per call, but it saves items in order and stops at the first one that fails, leaving the earlier ones saved.
# If you get a 429 (too many requests), slow down and rerun; items already set are reported as unchanged.
#
# You can do the same thing without code with the Batch Item Update tool (the MyAccount Frequency Change option).

dry_run = true # change_me: false to save

# change_me: the automatic enrollment items to update
merchant_item_ids = %w[AUTOSHIP-30 AUTOSHIP-60 AUTOSHIP-90]

# change_me: what customers may switch to.  Empty arrays turn the change off for these items.
schedules = ['Monthly', 'Every 2 Months', 'Every 3 Months']
day_counts = [30, 60, 90]
last_step_only = false

opts = {
  '_expand' => 'auto_order', # NOT auto_order.steps
  '_placeholders' => false
}

# Sorted so the comparison doesn't depend on order.  Day counts that match a standard schedule (10, 24, 28, 45)
# come back as that schedule, so such an item reports "changed" on every run; list those as schedules instead.
def describe(auto_order)
  return 'off' if auto_order.nil?

  item_schedules = (auto_order.auto_order_myaccount_frequency_schedules || []).sort
  item_day_counts = (auto_order.auto_order_myaccount_frequency_day_counts || []).sort
  return 'off' if item_schedules.empty? && item_day_counts.empty?

  suffix = auto_order.auto_order_myaccount_frequency_last_step_only ? ', last step only' : ''
  "[#{item_schedules.join(', ')}] days [#{item_day_counts.join(', ')}]#{suffix}"
end

item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)
updated = unchanged = skipped = failed = 0

merchant_item_ids.each do |merchant_item_id|
  item_response = item_api.get_item_by_merchant_item_id(merchant_item_id, opts)
  item = item_response.item
  if item.nil?
    puts "#{merchant_item_id}: not found, skipped"
    skipped += 1
    next
  end

  auto_order = item.auto_order
  if auto_order.nil? || !auto_order.auto_order_upsell
    puts "#{merchant_item_id}: does not use automatic enrollment, skipped"
    skipped += 1
    next
  end

  before = describe(auto_order)
  auto_order.auto_order_myaccount_frequency_schedules = schedules
  auto_order.auto_order_myaccount_frequency_day_counts = day_counts
  auto_order.auto_order_myaccount_frequency_last_step_only = last_step_only
  after = describe(auto_order)

  if before == after
    puts "#{merchant_item_id}: already #{after}, unchanged"
    unchanged += 1
    next
  end

  if dry_run
    puts "#{merchant_item_id}: would change #{before} -> #{after}"
    updated += 1
    next
  end

  update_response = item_api.update_item(item.merchant_item_oid, item, opts)
  puts "#{merchant_item_id}: changed #{before} -> #{describe(update_response.item.auto_order)}"
  updated += 1

rescue UltracartClient::ApiError => e
  # A 400 explains itself: feature not enabled on the account, unknown schedule name, or a bad day count.
  puts "#{merchant_item_id}: FAILED #{e.code} #{e.response_body}"
  failed += 1
end

puts "#{dry_run ? 'Dry run. Would update' : 'Updated'}: #{updated}, unchanged: #{unchanged}, skipped: #{skipped}, failed: #{failed}"
