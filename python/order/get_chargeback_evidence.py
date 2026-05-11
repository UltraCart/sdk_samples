"""
get_chargeback_evidence.py

Pulls everything from UltraCart that is useful when fighting a chargeback
dispute and prints a formatted evidence report. Designed as a starting point
for building the actual evidence packet you submit to the card processor.

What this sample demonstrates:
  1. Order detail with the SPECIFIC expansions a chargeback case relies on.
     Notice we list every expansion explicitly - no shortcuts. Listing them
     individually keeps your payload small and forces you to think about
     what evidence each one represents.
  2. Email delivery records via the dedicated /emails endpoint (not via
     expansion). Use the dedicated endpoint for chargeback work - it is the
     canonical full-fidelity source for SES delivery events on every order.
  3. Page view history (the customer was on your site, navigated through
     pages, spent time before placing the order).
  4. Auto-order detection: a large fraction of chargebacks are subscription
     disputes ("I never authorized this rebill"). When the order is part of
     an auto order, this sample pulls the parent subscription, every rebill
     that has occurred on it, and the auto-order-level email log. For rebills
     specifically, the page-view lookup pivots to the ORIGINAL order, since
     the rebill itself has no checkout session.
  5. Shipment journey data via the shipping.tracking_number_details expansion
     - carrier, current status, ETA, and per-scan event history. This is the
     standard "proof of delivery" exhibit for "item not received" chargebacks.
     NOTE: package tracking is an OPTIONAL feature that the merchant has to
     enable on their UltraCart account. If it is not enabled, or if tracking
     has not yet been posted for the order, the array will be empty and the
     section will say so.

Usage:
    PYTHONPATH=. python order/get_chargeback_evidence.py DEMO-0009104976

Requires the May 2026 SDK build that includes get_order_emails,
get_order_page_view_history, and get_auto_order_emails.
"""

import sys
from datetime import datetime

from ultracart.apis import OrderApi, AutoOrderApi
from samples import api_client


# --------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------
order_id = sys.argv[1] if len(sys.argv) > 1 else "DEMO-0009104976"

client = api_client()
order_api = OrderApi(client)
auto_order_api = AutoOrderApi(client)

# Listing expansions individually (rather than relying on a catch-all) keeps
# payload size predictable and makes it obvious what evidence each piece is
# providing. Add or remove based on what your dispute reason code requires.
order_expansion = ",".join([
    "billing",                  # address customer entered for billing
    "shipping",                 # address goods shipped to
    "shipping.tracking_number_details",  # carrier scans, delivery status, ETA (requires the optional package-tracking feature)
    "payment",                  # payment method, card last four, gateway info
    "payment.transaction",      # auth/capture/refund timeline
    "summary",                  # totals, tax, shipping, weights
    "items",                    # line items the customer ordered
    "coupon",                   # discounts the customer chose to apply
    "customer_profile",         # returning-customer signal, account history
    "auto_order",               # detect subscription chargebacks
    "utms",                     # entry-path UTM clicks (attribution chain)
    "marketing",                # affiliate / source-code attribution
    "gift",                     # gift-giving intent if applicable
    "point_of_sale",            # POS terminal / location for retail orders
    "channel_partner",          # channel partner data (Amazon, eBay, etc.)
])

auto_order_expansion = ",".join([
    "items",                    # subscription line items + frequency
    "rebill_orders",            # every rebill that has occurred
    "logs",                     # status changes, payment attempts, cancellations
    "management",               # self-service management state
])


# --------------------------------------------------------------------
# Pull the data
# --------------------------------------------------------------------
def fail(operation, error):
    print(f"ERROR in {operation}:")
    print(f"  Developer message: {error.developer_message}")
    print(f"  User message:      {error.user_message}")
    sys.exit(1)


order_response = order_api.get_order(order_id, expand=order_expansion)
if getattr(order_response, "error", None):
    fail("get_order", order_response.error)
order = order_response.order

# Use the dedicated /emails endpoint rather than _expand=emails. The dedicated
# endpoint is the canonical full-fidelity source for SES delivery events.
emails_response = order_api.get_order_emails(order_id)
if getattr(emails_response, "error", None):
    fail("get_order_emails", emails_response.error)
emails = emails_response.emails or []

# Auto-order chain (if applicable). Resolve this BEFORE pulling page views
# because a rebill's own page view history is empty - the customer never went
# through checkout for the rebill, so the meaningful history lives on the
# original order that started the subscription.
auto_order = None
auto_order_emails = []
rebill_orders = []
auto_order_pointer = order.auto_order  # populated by ?_expand=auto_order
if auto_order_pointer is not None and auto_order_pointer.auto_order_oid is not None:
    auto_order_oid = auto_order_pointer.auto_order_oid

    ao_response = auto_order_api.get_auto_order(auto_order_oid, expand=auto_order_expansion)
    if getattr(ao_response, "error", None):
        fail("get_auto_order", ao_response.error)
    auto_order = ao_response.auto_order
    rebill_orders = auto_order.rebill_orders or []

    ao_emails_response = auto_order_api.get_auto_order_emails(auto_order_oid)
    if getattr(ao_emails_response, "error", None):
        fail("get_auto_order_emails", ao_emails_response.error)
    auto_order_emails = ao_emails_response.emails or []

# For a rebill chargeback, the page view history that matters is the one from
# the ORIGINAL order's checkout session.
page_view_order_id = order_id
page_view_is_redirected = False
if auto_order is not None:
    original_order_id = auto_order.original_order_id
    if original_order_id and original_order_id.lower() != order_id.lower():
        page_view_order_id = original_order_id
        page_view_is_redirected = True

page_view_response = order_api.get_order_page_view_history(page_view_order_id)
if getattr(page_view_response, "error", None):
    fail("get_order_page_view_history", page_view_response.error)
page_views = page_view_response.page_views or []
session_referrer = page_view_response.referrer


# --------------------------------------------------------------------
# Tiny formatting primitives
# --------------------------------------------------------------------
def hr(char="="):
    print(char * 80)


def section(title):
    print()
    hr("=")
    print(f"  {title}")
    hr("=")
    print()


def subsection(title):
    print()
    print(f"  {title}")
    print("  " + "-" * len(title))


def kv(label, value, width=22):
    print(f"  {(label + ':').ljust(width)} {value if value is not None else ''}")


# SDK money fields are Currency objects, not raw numbers. Pull the localized
# value off; None-safe for missing/optional fields.
def money_value(currency):
    if currency is None:
        return None
    return getattr(currency, "localized", None)


def money(amount, currency):
    if amount is None:
        return ""
    sign = "-" if amount < 0 else ""
    return f"{sign}${abs(amount):,.2f} {currency or ''}"


def shorten(s, n):
    s = s or ""
    return s if len(s) <= n else s[: n - 1] + "~"


# --------------------------------------------------------------------
# Render the report
# --------------------------------------------------------------------
def render_address(address):
    if address is None:
        print("  (none on file)")
        return
    name = " ".join(filter(None, [address.first_name, address.last_name])).strip()
    company = address.company or ""
    line1 = address.address1 or ""
    line2 = address.address2 or ""
    city_row = (
        (address.city or "")
        + (f", {address.state_region}" if address.state_region else "")
        + " " + (address.postal_code or "")
    ).strip()
    country = address.country_code or ""
    for line in filter(None, [name, company, line1, line2, city_row, country]):
        print(f"  {line}")


def render_email_detail(i, email):
    internal = "   (internal copy)" if email.internal else ""
    print(f"  [{i}] sent {email.send_dts or '?'}{internal}")
    print(f"      To:               {email.email or ''}")
    print(f"      Subject:          {email.subject or ''}")

    states = []
    if email.delivered:                 states.append("DELIVERED")
    if email.skipped:                   states.append("SKIPPED")
    if email.bounce_dts is not None:    states.append(f"BOUNCED {email.bounce_dts}")
    if email.opened:                    states.append(f"OPENED {email.opened_dts or ''}")
    if email.clicked:                   states.append(f"CLICKED {email.clicked_dts or ''}")
    print(f"      Status:           {', '.join(states) if states else 'unknown'}")

    if email.delivery_dts:           print(f"      Delivered:        {email.delivery_dts}")
    if email.reporting_mta:          print(f"      Reporting MTA:    {email.reporting_mta}")
    if email.smtp_response:          print(f"      SMTP response:    {email.smtp_response}")
    if email.bounce_type:            print(f"      Bounce type:      {email.bounce_type} / {email.bounce_sub_type or ''}")
    if email.bounce_diagnostic_code: print(f"      Diagnostic:       {email.bounce_diagnostic_code}")
    if email.skip_reason:            print(f"      Skip reason:      {email.skip_reason}")
    print()


# Header
hr("=")
print("  CHARGEBACK EVIDENCE REPORT")
print("  UltraCart REST API v2")
hr("=")
print()
kv("Order ID", order_id)
kv("Generated", datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"))

# Section 1: Order overview
section("1. ORDER OVERVIEW")
kv("Placed", order.creation_dts)
kv("Stage", order.current_stage)
kv("Currency", order.currency_code)
if order.summary is not None:
    kv("Order Total", money(money_value(order.summary.total), order.currency_code))

subsection("Customer")
billing = order.billing
if billing is not None:
    name = " ".join(filter(None, [billing.first_name, billing.last_name])).strip()
    kv("Name", name)
    kv("Email", billing.email)
    # First populated phone wins
    kv("Phone", billing.day_phone or billing.evening_phone or billing.cell_phone)
cp = order.customer_profile
if cp is not None:
    kv("Customer Profile", f"yes (oid {cp.customer_profile_oid or '?'})")
else:
    kv("Customer Profile", "no (guest checkout)")
marketing = order.marketing
if marketing is not None and getattr(marketing, "advertising_source", None):
    kv("Advertising Source", marketing.advertising_source)
if marketing is not None and getattr(marketing, "referral_code", None):
    kv("Referral Code", marketing.referral_code)

subsection("Billing Address")
render_address(billing)

subsection("Shipping Address")
render_address(order.shipping)

subsection("Items")
for item in order.items or []:
    if item.kit_component:  # skip kit components - they are sub-rows of a parent kit
        continue
    qty = item.quantity or 0
    cost = money_value(item.cost) or 0  # OrderItem.cost is a Currency object
    print(f"  {shorten(item.merchant_item_id or '', 12).ljust(12)} {shorten(item.description or '', 32).ljust(32)} qty {qty} @ {money(cost, order.currency_code)} = {money(qty * cost, order.currency_code)}")

if order.summary is not None:
    print()
    kv("Subtotal", money(money_value(order.summary.subtotal), order.currency_code))
    if order.summary.tax is not None:
        kv("Tax", money(money_value(order.summary.tax), order.currency_code))
    if getattr(order.summary, "shipping_handling_total", None) is not None:
        kv("Shipping", money(money_value(order.summary.shipping_handling_total), order.currency_code))
    kv("Total", money(money_value(order.summary.total), order.currency_code))

subsection("Payment")
payment = order.payment
if payment is not None:
    kv("Method", payment.payment_method)
    cc = payment.credit_card
    if cc is not None:
        card_summary = f"{cc.card_type or ''} ending {cc.card_number_truncated or '????'}".strip()
        kv("Card", card_summary)
    transactions = payment.transactions or []
    if transactions:
        subsection("Transactions")
        for tx in transactions:
            status = "approved" if tx.successful else "failed"
            print(f"  {(tx.transaction_timestamp or '').ljust(21)} {shorten(tx.transaction_gateway or '', 30).ljust(30)} {status}")

subsection("Marketing / Attribution")
utms = order.utms or []
# Affiliate attribution lives on OrderAffiliate (expansion=affiliate); not pulled
# here to keep the chargeback request light.
if not utms:
    print("  No UTM clicks captured.")
else:
    most_recent = utms[0]  # index 0 is most recent click
    kv("Most recent UTM source",   most_recent.utm_source)
    kv("Most recent UTM medium",   most_recent.utm_medium)
    kv("Most recent UTM campaign", most_recent.utm_campaign)
    kv("UTM clicks captured", str(len(utms)))

# Section 2: Shipment tracking
section("2. SHIPMENT TRACKING")
shipping = order.shipping
if shipping is None:
    print("  No shipping address on file - this order may not have been a physical shipment.")
else:
    tracking_details = getattr(shipping, "tracking_number_details", None) or []
    plain_trackings = getattr(shipping, "tracking_numbers", None) or []

    if tracking_details:
        # Rich tracking data - carrier, status, ETA, per-scan events.
        for idx, td in enumerate(tracking_details, start=1):
            if len(tracking_details) > 1:
                subsection(f"Shipment {idx} of {len(tracking_details)}")
            kv("Carrier",           getattr(td, "shipping_method", None))
            kv("Tracking #",        getattr(td, "tracking_number", None))
            status = getattr(td, "status", None) or ""
            desc = getattr(td, "status_description", None) or ""
            kv("Status",            f"{status}  {desc}".strip() or None)
            kv("Tracking URL",      getattr(td, "tracking_url", None))
            kv("Shipped",           getattr(td, "shipped_date_formatted", None) or getattr(td, "shipped_date", None))
            kv("Expected Delivery", getattr(td, "expected_delivery_date_formatted", None) or getattr(td, "expected_delivery_date", None))
            kv("Actual Delivery",   getattr(td, "actual_delivery_date_formatted", None) or getattr(td, "actual_delivery_date", None))

            events = getattr(td, "details", None) or []
            if not events:
                print()
                print("  No tracking events captured yet.")
            else:
                subsection("Tracking Events")
                # Most carriers feed events newest-first; preserve whatever order the API returned.
                for ev in events:
                    when = getattr(ev, "event_dts", None) or (
                        f"{getattr(ev, 'event_local_date', '') or ''} {getattr(ev, 'event_local_time', '') or ''}".strip()
                    )
                    tag = getattr(ev, "tag_description", None) or getattr(ev, "tag", None) or ""
                    city = getattr(ev, "city", None) or ""
                    state = getattr(ev, "state", None) or ""
                    location = ", ".join(filter(None, [city, state]))
                    sub = getattr(ev, "subtag_message", None) or ""
                    print(f"  {(when or '').ljust(22)} {shorten(tag, 22).ljust(22)} {location}")
                    if sub:
                        print(f"  {' ' * 22} {sub}")
    elif plain_trackings:
        # Feature not enabled (or carrier feed unavailable) - fall back to the
        # plain tracking numbers we have on file.
        print("  Detailed carrier scan data is not available for this order.")
        print("  (Detailed tracking is an optional UltraCart feature that must be enabled")
        print("  on the merchant account. Falling back to the plain tracking numbers below.)")
        print()
        subsection("Tracking Numbers")
        for tn in plain_trackings:
            print(f"  {tn}")
    else:
        print("  No shipment tracking on file for this order.")
        print("  This is expected for digital goods, will-call/pickup orders, or orders")
        print("  where tracking has not yet been posted by the carrier. Detailed carrier")
        print("  scan data also requires the optional package-tracking feature to be")
        print("  enabled on the merchant account.")

# Section 3: Subscription
section("3. SUBSCRIPTION DETAILS")
if auto_order is None:
    print("  This order is NOT part of an auto order subscription.")
else:
    print("  This order IS part of an auto order subscription.")
    print()
    kv("Auto Order Code", auto_order.auto_order_code)
    kv("Status", auto_order.status)
    kv("Enabled", "yes" if auto_order.enabled else "no")
    kv("Original Order", auto_order.original_order_id)
    kv("Next Attempt", auto_order.next_attempt or "(none scheduled)")
    if auto_order.canceled_dts is not None:
        kv("Canceled", auto_order.canceled_dts)
        kv("Canceled By", auto_order.canceled_by_user or "")
        kv("Cancel Reason", auto_order.cancel_reason or "")
    kv("Total Rebills", str(len(rebill_orders)))

    ao_items = auto_order.items or []
    if ao_items:
        subsection("Items in Subscription")
        for aoi in ao_items:
            print(f"  {shorten(aoi.original_item_id or '', 12).ljust(12)} {shorten(aoi.original_item_id or '', 32).ljust(32)} frequency: {aoi.frequency or ''}")

    if rebill_orders:
        subsection("Rebill Timeline")
        rebill_orders.sort(key=lambda r: r.creation_dts or "")
        for ro in rebill_orders:
            ro_id = ro.order_id or ""
            marker = "  *** THIS ORDER" if ro_id.lower() == order_id.lower() else ""
            ro_total = money(money_value(ro.summary.total), ro.currency_code or "USD") if ro.summary else ""
            print(f"  {(ro.creation_dts or '').ljust(22)} {ro_id.ljust(22)} {ro_total.ljust(10)} {ro.current_stage or ''}{marker}")

    if auto_order_emails:
        subsection(f"Subscription-Level Emails ({len(auto_order_emails)})")
        for i, email in enumerate(auto_order_emails, start=1):
            render_email_detail(i, email)
    else:
        subsection("Subscription-Level Emails")
        print("  No subscription-level emails on record.")

# Section 4: Emails
section(f"4. EMAIL DELIVERY ({len(emails)} messages)")
if not emails:
    print("  No email delivery records on file for this order.")
else:
    for i, email in enumerate(emails, start=1):
        render_email_detail(i, email)

# Section 5: Page view history
section(f"5. PAGE VIEW HISTORY ({len(page_views)} views)")
if page_view_is_redirected:
    print("  Note: this is a subscription rebill. The disputed order itself has no")
    print("  checkout session of its own. The page views below are from the ORIGINAL")
    print("  order that started the subscription, where the customer's intent was")
    print("  captured during signup.")
    print()
    kv("Source order", page_view_order_id)
kv("Session referrer", session_referrer or "(direct or unknown)")

if not page_views:
    print()
    print(f"  No page views captured{' for the original order.' if page_view_is_redirected else ' for this order session.'}")
else:
    subsection("Timeline")
    for pv in page_views:
        top_s = "   -" if pv.time_on_page is None else f"{pv.time_on_page:4d}s"
        print(f"  {(pv.view_dts or '').ljust(22)} {top_s}   {pv.url or ''}")

    if len(page_views) >= 2:
        try:
            first = datetime.fromisoformat((page_views[0].view_dts or "").replace("Z", "+00:00"))
            last = datetime.fromisoformat((page_views[-1].view_dts or "").replace("Z", "+00:00"))
            elapsed = int((last - first).total_seconds())
            if elapsed > 0:
                mins, secs = divmod(elapsed, 60)
                print()
                kv("Session length", f"{mins}m {secs}s (first view to last view)")
        except (ValueError, TypeError):
            pass
    unique_urls = {pv.url for pv in page_views if pv.url}
    kv("Unique URLs visited", str(len(unique_urls)))

# Footer
print()
hr("=")
print("  END OF EVIDENCE REPORT")
hr("=")
