# get_chargeback_evidence.rb
#
# Pulls everything from UltraCart that is useful when fighting a chargeback
# dispute and prints a formatted evidence report. Designed as a starting point
# for building the actual evidence packet you submit to the card processor.
#
# What this sample demonstrates:
#   1. Order detail with the SPECIFIC expansions a chargeback case relies on.
#      Notice we list every expansion explicitly - no shortcuts. Listing them
#      individually keeps your payload small and forces you to think about
#      what evidence each one represents.
#   2. Email delivery records via the dedicated /emails endpoint (not via
#      expansion). Use the dedicated endpoint for chargeback work - it is the
#      canonical full-fidelity source for SES delivery events on every order.
#   3. Page view history (the customer was on your site, navigated through
#      pages, spent time before placing the order).
#   4. Auto-order detection: a large fraction of chargebacks are subscription
#      disputes ("I never authorized this rebill"). When the order is part of
#      an auto order, this sample pulls the parent subscription, every rebill
#      that has occurred on it, and the auto-order-level email log. For rebills
#      specifically, the page-view lookup pivots to the ORIGINAL order, since
#      the rebill itself has no checkout session.
#   5. Shipment journey data via the shipping.tracking_number_details expansion
#      - carrier, current status, ETA, and per-scan event history. This is the
#      standard "proof of delivery" exhibit for "item not received" chargebacks.
#      NOTE: package tracking is an OPTIONAL feature that the merchant has to
#      enable on their UltraCart account. If it is not enabled, or if tracking
#      has not yet been posted for the order, the array will be empty and the
#      section will fall back to the plain tracking_numbers list (if any).
#
# Usage:
#   ruby order/get_chargeback_evidence.rb DEMO-0009104976
#
# Requires the May 2026 SDK build that includes get_order_emails,
# get_order_page_view_history, and get_auto_order_emails.

require 'ultracart_api'
require 'date'
require_relative '../constants'

order_id = ARGV[0] || 'DEMO-0009104976'

order_api      = UltracartClient::OrderApi.new_using_api_key(Constants::API_KEY)
auto_order_api = UltracartClient::AutoOrderApi.new_using_api_key(Constants::API_KEY)

# Listing expansions individually (rather than relying on a catch-all) keeps
# payload size predictable and makes it obvious what evidence each piece is
# providing. Add or remove based on what your dispute reason code requires.
order_expansion = %w[
  billing
  shipping
  shipping.tracking_number_details
  payment
  payment.transaction
  summary
  items
  coupon
  customer_profile
  auto_order
  utms
  marketing
  gift
  point_of_sale
  channel_partner
].join(',')

auto_order_expansion = %w[items rebill_orders logs management].join(',')

# --------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------
def fail_op(operation, error)
  puts "ERROR in #{operation}:"
  puts "  Developer message: #{error.developer_message}"
  puts "  User message:      #{error.user_message}"
  exit 1
end

def hr(char = '=')
  puts char * 80
end

def section(title)
  puts
  hr('=')
  puts "  #{title}"
  hr('=')
  puts
end

def subsection(title)
  puts
  puts "  #{title}"
  puts "  #{'-' * title.length}"
end

def kv(label, value, width = 22)
  puts "  #{(label + ':').ljust(width)} #{value || ''}"
end

# SDK money fields are Currency objects, not raw numbers. Pull the localized
# value off; nil-safe for missing/optional fields.
def money_value(currency)
  return nil if currency.nil?

  currency.respond_to?(:localized) ? currency.localized : nil
end

def money(amount, currency)
  return '' if amount.nil?

  sign = amount.negative? ? '-' : ''
  format("#{sign}$%s %s", amount.abs.to_f.round(2), currency || '').strip
end

def shorten(str, max)
  s = str || ''
  s.length <= max ? s : s[0, max - 1] + '~'
end

def render_address(addr)
  if addr.nil?
    puts '  (none on file)'
    return
  end

  name = [addr.first_name, addr.last_name].compact.join(' ').strip
  city_row = [addr.city, addr.state_region].compact.reject(&:empty?).join(', ').strip
  city_row = "#{city_row} #{addr.postal_code}".strip if addr.postal_code

  [name, addr.company, addr.address1, addr.address2, city_row, addr.country_code]
    .reject { |line| line.nil? || line.strip.empty? }
    .each { |line| puts "  #{line}" }
end

def render_email_detail(idx, email)
  internal = email.internal ? '   (internal copy)' : ''
  puts "  [#{idx}] sent #{email.send_dts || '?'}#{internal}"
  puts "      To:               #{email.email || ''}"
  puts "      Subject:          #{email.subject || ''}"

  states = []
  states << 'DELIVERED'                                        if email.delivered
  states << 'SKIPPED'                                          if email.skipped
  states << "BOUNCED #{email.bounce_dts}"                      unless email.bounce_dts.nil?
  states << "OPENED #{email.opened_dts || ''}"                 if email.opened
  states << "CLICKED #{email.clicked_dts || ''}"               if email.clicked
  puts "      Status:           #{states.empty? ? 'unknown' : states.join(', ')}"

  puts "      Delivered:        #{email.delivery_dts}"           unless email.delivery_dts.nil?
  puts "      Reporting MTA:    #{email.reporting_mta}"          unless email.reporting_mta.nil?
  puts "      SMTP response:    #{email.smtp_response}"          unless email.smtp_response.nil?
  puts "      Bounce type:      #{email.bounce_type} / #{email.bounce_sub_type || ''}" unless email.bounce_type.nil?
  puts "      Diagnostic:       #{email.bounce_diagnostic_code}" unless email.bounce_diagnostic_code.nil?
  puts "      Skip reason:      #{email.skip_reason}"            unless email.skip_reason.nil?
  puts
end

# --------------------------------------------------------------------
# Pull the data
# --------------------------------------------------------------------
order_response = order_api.get_order(order_id, '_expand' => order_expansion)
fail_op('get_order', order_response.error) if order_response.error
order = order_response.order

# Use the dedicated /emails endpoint rather than _expand=emails. The dedicated
# endpoint is the canonical full-fidelity source for SES delivery events.
emails_response = order_api.get_order_emails(order_id)
fail_op('get_order_emails', emails_response.error) if emails_response.error
emails = emails_response.emails || []

# Auto-order chain (if applicable). Resolve this BEFORE pulling page views
# because a rebill's own page view history is empty - the customer never went
# through checkout for the rebill, so the meaningful history lives on the
# original order that started the subscription.
auto_order        = nil
auto_order_emails = []
rebill_orders     = []
auto_order_pointer = order.auto_order
if !auto_order_pointer.nil? && !auto_order_pointer.auto_order_oid.nil?
  auto_order_oid = auto_order_pointer.auto_order_oid

  ao_response = auto_order_api.get_auto_order(auto_order_oid, '_expand' => auto_order_expansion)
  fail_op('get_auto_order', ao_response.error) if ao_response.error
  auto_order    = ao_response.auto_order
  rebill_orders = auto_order.rebill_orders || []

  ao_emails_response = auto_order_api.get_auto_order_emails(auto_order_oid)
  fail_op('get_auto_order_emails', ao_emails_response.error) if ao_emails_response.error
  auto_order_emails = ao_emails_response.emails || []
end

# For a rebill chargeback, the page view history that matters is the one from
# the ORIGINAL order's checkout session.
page_view_order_id      = order_id
page_view_is_redirected = false
if !auto_order.nil? &&
   !auto_order.original_order_id.nil? &&
   auto_order.original_order_id.casecmp(order_id) != 0
  page_view_order_id      = auto_order.original_order_id
  page_view_is_redirected = true
end

page_view_response = order_api.get_order_page_view_history(page_view_order_id)
fail_op('get_order_page_view_history', page_view_response.error) if page_view_response.error
page_views       = page_view_response.page_views || []
session_referrer = page_view_response.referrer

# --------------------------------------------------------------------
# Render the report
# --------------------------------------------------------------------
hr('=')
puts '  CHARGEBACK EVIDENCE REPORT'
puts '  UltraCart REST API v2'
hr('=')
puts
kv('Order ID', order_id)
kv('Generated', Time.now.utc.strftime('%Y-%m-%dT%H:%M:%SZ'))

# Section 1: Order overview
section('1. ORDER OVERVIEW')
kv('Placed',   order.creation_dts)
kv('Stage',    order.current_stage)
kv('Currency', order.currency_code)
kv('Order Total', money(money_value(order.summary.total), order.currency_code)) if order.summary

subsection('Customer')
billing = order.billing
if billing
  kv('Name', [billing.first_name, billing.last_name].compact.join(' ').strip)
  kv('Email', billing.email)
  # First populated phone wins
  kv('Phone', billing.day_phone || billing.evening_phone || billing.cell_phone)
end
cp = order.customer_profile
if cp
  kv('Customer Profile', "yes (oid #{cp.customer_profile_oid || '?'})")
else
  kv('Customer Profile', 'no (guest checkout)')
end
marketing = order.marketing
kv('Advertising Source', marketing.advertising_source) if marketing && marketing.respond_to?(:advertising_source) && marketing.advertising_source
kv('Referral Code', marketing.referral_code)            if marketing && marketing.respond_to?(:referral_code)      && marketing.referral_code

subsection('Billing Address')
render_address(billing)

subsection('Shipping Address')
render_address(order.shipping)

subsection('Items')
(order.items || []).each do |item|
  next if item.kit_component # skip kit components - they are sub-rows of a parent kit

  qty  = item.quantity || 0
  cost = money_value(item.cost) || 0 # OrderItem.cost is a Currency object
  printf(
    "  %-12s %-32s qty %s @ %s = %s\n",
    shorten(item.merchant_item_id || '', 12),
    shorten(item.description || '', 32),
    qty,
    money(cost, order.currency_code),
    money(qty * cost, order.currency_code)
  )
end

if order.summary
  puts
  kv('Subtotal', money(money_value(order.summary.subtotal), order.currency_code))
  kv('Tax',      money(money_value(order.summary.tax), order.currency_code))                  unless order.summary.tax.nil?
  if order.summary.respond_to?(:shipping_handling_total) && !order.summary.shipping_handling_total.nil?
    kv('Shipping', money(money_value(order.summary.shipping_handling_total), order.currency_code))
  end
  kv('Total',    money(money_value(order.summary.total), order.currency_code))
end

subsection('Payment')
payment = order.payment
if payment
  kv('Method', payment.payment_method)
  cc = payment.credit_card
  if cc
    kv('Card', "#{cc.card_type || ''} ending #{cc.card_number_truncated || '????'}".strip)
  end
  transactions = payment.transactions || []
  unless transactions.empty?
    subsection('Transactions')
    transactions.each do |tx|
      status = tx.successful ? 'approved' : 'failed'
      printf(
        "  %-21s %-30s %s\n",
        tx.transaction_timestamp || '',
        shorten(tx.transaction_gateway || '', 30),
        status
      )
    end
  end
end

subsection('Marketing / Attribution')
utms = order.utms || []
# Affiliate attribution lives on OrderAffiliate (expansion=affiliate); not pulled
# here to keep the chargeback request light.
if utms.empty?
  puts '  No UTM clicks captured.'
else
  most_recent = utms[0] # index 0 is most recent click
  kv('Most recent UTM source',   most_recent.utm_source)
  kv('Most recent UTM medium',   most_recent.utm_medium)
  kv('Most recent UTM campaign', most_recent.utm_campaign)
  kv('UTM clicks captured', utms.length.to_s)
end

# Section 2: Shipment tracking
section('2. SHIPMENT TRACKING')
shipping = order.shipping
if shipping.nil?
  puts '  No shipping address on file - this order may not have been a physical shipment.'
else
  tracking_details = shipping.respond_to?(:tracking_number_details) ? (shipping.tracking_number_details || []) : []
  plain_trackings  = shipping.respond_to?(:tracking_numbers)        ? (shipping.tracking_numbers || [])        : []

  if !tracking_details.empty?
    # Rich tracking data - carrier, status, ETA, per-scan events.
    tracking_details.each_with_index do |td, idx|
      subsection("Shipment #{idx + 1} of #{tracking_details.length}") if tracking_details.length > 1
      kv('Carrier',           td.respond_to?(:shipping_method) ? td.shipping_method : nil)
      kv('Tracking #',        td.respond_to?(:tracking_number) ? td.tracking_number : nil)
      status_text = "#{td.respond_to?(:status) ? td.status : ''}  #{td.respond_to?(:status_description) ? td.status_description : ''}".strip
      kv('Status',            status_text.empty? ? nil : status_text)
      kv('Tracking URL',      td.respond_to?(:tracking_url) ? td.tracking_url : nil)
      kv('Shipped',           (td.respond_to?(:shipped_date_formatted) && td.shipped_date_formatted) || (td.respond_to?(:shipped_date) ? td.shipped_date : nil))
      kv('Expected Delivery', (td.respond_to?(:expected_delivery_date_formatted) && td.expected_delivery_date_formatted) || (td.respond_to?(:expected_delivery_date) ? td.expected_delivery_date : nil))
      kv('Actual Delivery',   (td.respond_to?(:actual_delivery_date_formatted) && td.actual_delivery_date_formatted) || (td.respond_to?(:actual_delivery_date) ? td.actual_delivery_date : nil))

      events = td.respond_to?(:details) ? (td.details || []) : []
      if events.empty?
        puts
        puts '  No tracking events captured yet.'
      else
        subsection('Tracking Events')
        # Most carriers feed events newest-first; preserve whatever order the API returned.
        events.each do |ev|
          when_s = (ev.respond_to?(:event_dts) && ev.event_dts) ||
                   "#{ev.respond_to?(:event_local_date) ? ev.event_local_date : ''} #{ev.respond_to?(:event_local_time) ? ev.event_local_time : ''}".strip
          tag = (ev.respond_to?(:tag_description) && ev.tag_description) || (ev.respond_to?(:tag) ? ev.tag : '') || ''
          city = ev.respond_to?(:city) ? (ev.city || '') : ''
          state = ev.respond_to?(:state) ? (ev.state || '') : ''
          location = [city, state].reject { |s| s.nil? || s.empty? }.join(', ')
          sub = ev.respond_to?(:subtag_message) ? (ev.subtag_message || '') : ''
          printf("  %-22s %-22s %s\n", when_s || '', shorten(tag, 22), location)
          puts "  #{' ' * 22} #{sub}" unless sub.empty?
        end
      end
    end
  elsif !plain_trackings.empty?
    # Feature not enabled (or carrier feed unavailable) - fall back to the
    # plain tracking numbers we have on file.
    puts '  Detailed carrier scan data is not available for this order.'
    puts '  (Detailed tracking is an optional UltraCart feature that must be enabled'
    puts '  on the merchant account. Falling back to the plain tracking numbers below.)'
    puts
    subsection('Tracking Numbers')
    plain_trackings.each { |tn| puts "  #{tn}" }
  else
    puts '  No shipment tracking on file for this order.'
    puts '  This is expected for digital goods, will-call/pickup orders, or orders'
    puts '  where tracking has not yet been posted by the carrier. Detailed carrier'
    puts '  scan data also requires the optional package-tracking feature to be'
    puts '  enabled on the merchant account.'
  end
end

# Section 3: Subscription
section('3. SUBSCRIPTION DETAILS')
if auto_order.nil?
  puts '  This order is NOT part of an auto order subscription.'
else
  puts '  This order IS part of an auto order subscription.'
  puts
  kv('Auto Order Code', auto_order.auto_order_code)
  kv('Status',          auto_order.status)
  kv('Enabled',         auto_order.enabled ? 'yes' : 'no')
  kv('Original Order',  auto_order.original_order_id)
  kv('Next Attempt',    auto_order.next_attempt || '(none scheduled)')
  unless auto_order.canceled_dts.nil?
    kv('Canceled',      auto_order.canceled_dts)
    kv('Canceled By',   auto_order.canceled_by_user || '')
    kv('Cancel Reason', auto_order.cancel_reason || '')
  end
  kv('Total Rebills', rebill_orders.length.to_s)

  ao_items = auto_order.items || []
  unless ao_items.empty?
    subsection('Items in Subscription')
    ao_items.each do |aoi|
      printf(
        "  %-12s %-32s frequency: %s\n",
        shorten(aoi.original_item_id || '', 12),
        shorten(aoi.original_item_id || '', 32),
        aoi.frequency || ''
      )
    end
  end

  unless rebill_orders.empty?
    subsection('Rebill Timeline')
    rebill_orders.sort_by! { |r| r.creation_dts || '' }
    rebill_orders.each do |ro|
      ro_id    = ro.order_id || ''
      marker   = ro_id.casecmp(order_id) == 0 ? '  *** THIS ORDER' : ''
      ro_total = ro.summary ? money(money_value(ro.summary.total), ro.currency_code || 'USD') : ''
      printf(
        "  %-22s %-22s %-10s %s%s\n",
        ro.creation_dts || '',
        ro_id,
        ro_total,
        ro.current_stage || '',
        marker
      )
    end
  end

  if auto_order_emails.empty?
    subsection('Subscription-Level Emails')
    puts '  No subscription-level emails on record.'
  else
    subsection("Subscription-Level Emails (#{auto_order_emails.length})")
    auto_order_emails.each_with_index { |email, i| render_email_detail(i + 1, email) }
  end
end

# Section 4: Emails
section("4. EMAIL DELIVERY (#{emails.length} messages)")
if emails.empty?
  puts '  No email delivery records on file for this order.'
else
  emails.each_with_index { |email, i| render_email_detail(i + 1, email) }
end

# Section 5: Page view history
section("5. PAGE VIEW HISTORY (#{page_views.length} views)")
if page_view_is_redirected
  puts '  Note: this is a subscription rebill. The disputed order itself has no'
  puts '  checkout session of its own. The page views below are from the ORIGINAL'
  puts '  order that started the subscription, where the customer\'s intent was'
  puts '  captured during signup.'
  puts
  kv('Source order', page_view_order_id)
end
kv('Session referrer', session_referrer || '(direct or unknown)')

if page_views.empty?
  puts
  puts "  No page views captured#{page_view_is_redirected ? ' for the original order.' : ' for this order session.'}"
else
  subsection('Timeline')
  page_views.each do |pv|
    top_s = pv.time_on_page.nil? ? '   -' : format('%4ds', pv.time_on_page)
    printf("  %-22s %s   %s\n", pv.view_dts || '', top_s, pv.url || '')
  end

  if page_views.length >= 2
    begin
      first = DateTime.iso8601(page_views.first.view_dts)
      last  = DateTime.iso8601(page_views.last.view_dts)
      elapsed = ((last - first) * 24 * 60 * 60).to_i
      if elapsed.positive?
        mins = elapsed / 60
        secs = elapsed % 60
        puts
        kv('Session length', "#{mins}m #{secs}s (first view to last view)")
      end
    rescue ArgumentError, TypeError
      # ignore unparseable timestamps
    end
  end
  unique_urls = page_views.map(&:url).compact.uniq
  kv('Unique URLs visited', unique_urls.length.to_s)
end

puts
hr('=')
puts '  END OF EVIDENCE REPORT'
hr('=')
