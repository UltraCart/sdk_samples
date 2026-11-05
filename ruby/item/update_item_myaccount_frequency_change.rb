require 'ultracart_api'
require_relative '../constants'

# Scenario: an item uses automatic enrollment (the customer is put on a fixed auto order schedule at checkout and does
# not pick a frequency).  You want customers to be able to change the frequency of that item from MyAccount, for
# example to Monthly, Every 2 Months, or every 30, 60 or 90 days.
#
# Three properties on item.auto_order control this:
#   auto_order_myaccount_frequency_schedules       standard schedule names, e.g. "Monthly", "Every 2 Months"
#   auto_order_myaccount_frequency_day_counts      day counts, 1 to 365, at most 20, e.g. [30, 60, 90].  10, 24, 28 and
#                                                  45 are saved as the standard schedules "Every 10 Days" and so on.
#   auto_order_myaccount_frequency_last_step_only  only offer the change once the item is on its last auto order step
# Omit a property to leave it unchanged.  Send an empty array to clear it.  Empty schedules and day counts turn the
# MyAccount frequency change off for the item.
#
# Requirements:
# - UltraCart support must enable "MyAccount - Advanced Auto Order Settings" on your account.  Without it, setting
#   these properties returns a 400.
# - The item must use automatic enrollment (auto_order.auto_order_upsell = true).  Otherwise a 400.
# - The change is only offered to a customer when the item's auto order steps repeat forever.  An item whose steps end
#   (for example "Monthly x5, then stop") never offers it, whatever is set here.  UltraCart checks this when the
#   customer asks, not when you save the item.
#
# Expansion matters here:
# - Read the item with _expand=auto_order.  That returns the whole auto order section, including these properties.
# - Send that same auto_order object back.  When auto_order is present in an update, UltraCart writes every auto order
#   setting from it, so a partial or hand-built auto_order object would reset settings you did not mean to touch.
# - Do NOT add auto_order.steps to the expansion.  If steps are present in the update they replace the item's steps.
#   Leaving them out leaves the steps alone.
#
# What the customer sees: the allowed frequencies are offered on the auto order item in MyAccount.  A change takes
# effect after the next shipment; the next shipment date does not move.

def print_settings(auto_order)
  if auto_order.nil?
    puts '  (no auto order section)'
    return
  end
  puts "  Schedules: #{auto_order.auto_order_myaccount_frequency_schedules || '(none)'}"
  puts "  Day counts: #{auto_order.auto_order_myaccount_frequency_day_counts || '(none)'}"
  puts "  Last step only: #{auto_order.auto_order_myaccount_frequency_last_step_only || false}"
end

item_api = UltracartClient::ItemApi.new_using_api_key(Constants::API_KEY)

merchant_item_id = 'AUTOSHIP-30' # change_me: an item that uses automatic enrollment
opts = {
  '_expand' => 'auto_order', # NOT auto_order.steps, see above
  '_placeholders' => false
}

begin
  # Step 1. Read the item with its auto order section.
  item_response = item_api.get_item_by_merchant_item_id(merchant_item_id, opts)
  item = item_response.item
  auto_order = item.auto_order

  # Step 2. Make sure the item uses automatic enrollment.
  if auto_order.nil? || !auto_order.auto_order_upsell
    puts "Item #{merchant_item_id} does not use automatic enrollment.  Nothing to do."
    exit
  end

  puts 'Before:'
  print_settings(auto_order)

  # Step 3. Set the frequencies a customer may switch to.  Everything else in auto_order is sent back as read.
  auto_order.auto_order_myaccount_frequency_schedules = ['Monthly', 'Every 2 Months', 'Every 3 Months']
  auto_order.auto_order_myaccount_frequency_day_counts = [30, 60, 90]
  auto_order.auto_order_myaccount_frequency_last_step_only = false

  # To turn the change off for this item instead:
  # auto_order.auto_order_myaccount_frequency_schedules = []
  # auto_order.auto_order_myaccount_frequency_day_counts = []

  # Step 4. Save.  The same expansion returns the saved auto order section.
  update_response = item_api.update_item(item.merchant_item_oid, item, opts)

  puts 'After:'
  print_settings(update_response.item.auto_order)

rescue UltracartClient::ApiError => e
  # A 400 explains itself: feature not enabled on the account, item not automatic enrollment,
  # unknown schedule name, or a bad day count.
  puts 'An ApiException occurred. Please review the following error:'
  p e
  exit(1)
end
