# Fetch with expansion, mutate, persist. UltraCart does not support PATCH.
#
# Delay one item's next shipment in an auto-order by N days.
#
# This is the canonical pattern for editing an auto-order item in UltraCart:
#
#   1. GET the auto-order with the `items` expansion.
#   2. Mutate the target item IN PLACE on the object returned by GET.
#   3. PUT the full auto-order back.
#   4. Re-GET and verify the change actually persisted.
#
# UltraCart does NOT support PATCH on auto-orders. Sending a stripped-down item
# object on PUT is unsafe -- fields you omit (frequency, paused, arbitrary_*,
# options, etc.) can be lost, and updates to items in unusual states (e.g.
# mid free-trial) may silently no-op. Always echo the full item objects as
# returned by GET, then mutate only the field(s) you intend to change.
#
# Typical use case: a support bot or AI agent processing
#     "please delay my next shipment by 30 days"
# for a specific item in a multi-item auto-order.

require 'date'
require 'ultracart_api'
require_relative '../constants'

# Sample values. In a real integration these would come from the customer
# support request or AI agent context.
REFERENCE_ORDER_ID = 'DEMO-0009103116' # UltraCart order id that placed the auto-order
ITEM_ID            = 'ITEM001'         # the original_item_id you want to delay
DELAY_DAYS         = 30

# DO_WORK defaults to false (dry run). Flip to true to actually persist.
DO_WORK = false

# How many days before the new shipment date to set the preshipment notice.
PRESHIPMENT_NOTICE_LEAD_DAYS = 3

def isofmt(dt)
  dt.new_offset(DateTime.now.offset).strftime('%Y-%m-%dT%H:%M:%S.%L%:z')
end

def find_item(auto_order, item_id)
  (auto_order.items || []).find { |i| i.original_item_id == item_id }
end

auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

# 1. Fetch the full auto-order with items expansion. We need every field on
#    every item so we can PUT them back unchanged.
#
#    Alternative lookup: if you have the auto_order_code instead of the
#    reference order id, use:
#        auto_order_api.get_auto_order_by_code(auto_order_code, { :'_expand' => expand })
expand = 'items'
response = auto_order_api.get_auto_order_by_reference_order_id(
  REFERENCE_ORDER_ID, { :'_expand' => expand })
auto_order = response.auto_order
if auto_order.nil?
  warn "ERROR: No auto-order found for reference order #{REFERENCE_ORDER_ID}."
  exit 1
end

target = find_item(auto_order, ITEM_ID)
if target.nil?
  warn "ERROR: Item #{ITEM_ID} not found in auto-order for #{REFERENCE_ORDER_ID}."
  exit 1
end

current_dts_str = target.next_shipment_dts
if current_dts_str.nil? || current_dts_str.empty?
  warn "ERROR: Item #{ITEM_ID} has no next_shipment_dts; nothing to delay."
  exit 1
end

current_dts = DateTime.iso8601(current_dts_str)
now = DateTime.now.new_offset(current_dts.offset)

# 2. Compute the new dates. If the stored next_shipment_dts is in the past
#    (which can happen for items mid-cycle or post-trial), anchoring the
#    delay to that stale date would leave the customer with a near-term
#    shipment, not the delay they asked for. Anchor to whichever is later:
#    the stored date, or now.
anchor = [current_dts, now].max
new_shipment_dts = anchor + DELAY_DAYS
new_notice_dts = new_shipment_dts - PRESHIPMENT_NOTICE_LEAD_DAYS

if new_notice_dts <= now
  warn "ERROR: Computed preshipment notice #{isofmt(new_notice_dts)} is not in the future."
  exit 1
end

# 3. Mutate the target item IN PLACE. Do not rebuild the items array.
#    Every other field on the item (and every other item in the auto-order)
#    is preserved exactly as UltraCart returned it.
new_shipment_iso = isofmt(new_shipment_dts)
new_notice_iso = isofmt(new_notice_dts)
target.next_shipment_dts = new_shipment_iso
target.next_preshipment_notice_dts = new_notice_iso

puts '-' * 60
puts "Reference order:      #{REFERENCE_ORDER_ID}"
puts "Item:                 #{ITEM_ID}"
puts "Current next ship:    #{current_dts_str}"
puts "Proposed next ship:   #{new_shipment_iso}"
puts "Proposed notice:      #{new_notice_iso}"
puts 'Note: stored next_shipment_dts was in the past; anchored delay to today.' if current_dts < now
puts '-' * 60

unless DO_WORK
  puts 'DRY RUN -- no changes persisted. Set DO_WORK = true to apply.'
  exit 0
end

# 4. PUT the full auto-order back. Note the Ruby SDK's update_auto_order
#    parameter order: (body, oid, opts) -- body first, then the oid.
put_response = auto_order_api.update_auto_order(
  auto_order, auto_order.auto_order_oid, { :'_expand' => expand }
)
put_item = find_item(put_response.auto_order, ITEM_ID)
puts "PUT response next_shipment_dts: #{put_item ? put_item.next_shipment_dts : '(item not in response)'}"

# 5. Re-GET and verify the change actually persisted. UltraCart can echo a
#    value back in the PUT response without it sticking for items in
#    unusual states. A fresh GET is the only way to know for sure.
verify_response = auto_order_api.get_auto_order_by_reference_order_id(
  REFERENCE_ORDER_ID, { :'_expand' => expand })
verify_item = find_item(verify_response.auto_order, ITEM_ID)
verified_dts_str = verify_item ? verify_item.next_shipment_dts : nil

if verified_dts_str && DateTime.iso8601(verified_dts_str) == new_shipment_dts
  puts "VERIFIED: next_shipment_dts persisted as #{verified_dts_str}"
  exit 0
end

puts "WARNING: Re-GET shows next_shipment_dts = #{verified_dts_str.inspect}, " \
     "expected #{new_shipment_iso}."
puts 'The PUT was accepted by UltraCart but the value did not stick on re-read.'
puts 'This commonly indicates the item is in a state UltraCart manages ' \
     'automatically (e.g. mid free-trial). Escalate for human review.'
exit 2
