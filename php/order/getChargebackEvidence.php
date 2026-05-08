<?php
/*
 * getChargebackEvidence.php
 *
 * Pulls everything from UltraCart that is useful when fighting a chargeback
 * dispute and prints a formatted evidence report. Designed as a starting point
 * for building the actual evidence packet you submit to the card processor.
 *
 * What this sample demonstrates:
 *   1. Order detail with the SPECIFIC expansions a chargeback case relies on.
 *      Notice we list every expansion explicitly - no shortcuts. Listing them
 *      individually keeps your payload small and forces you to think about
 *      what evidence each one represents.
 *   2. Email delivery records (the customer was notified, when, by which path,
 *      whether they opened/bounced/clicked).
 *   3. Page view history (the customer was on your site, navigated through
 *      pages, spent time before placing the order).
 *   4. Auto-order detection: a large fraction of chargebacks are subscription
 *      disputes ("I never authorized this rebill"). When the order is part of
 *      an auto order, this sample pulls the parent subscription, every rebill
 *      that has occurred on it, and the auto-order-level email log so you can
 *      show the rebill schedule was disclosed and notified.
 *
 * Usage:
 *   php order/getChargebackEvidence.php DEMO-0009104976
 *
 *   Or pass nothing to use the hard-coded default.
 *
 * Output:
 *   A plain-text report. Run from CLI to read it directly; load in a browser
 *   to view it inside <pre> tags.
 *
 * SDK version requirements:
 *   This sample calls three endpoint methods that landed in the May 2026 API
 *   release: getOrderEmails, getOrderPageViewHistory, and getAutoOrderEmails.
 *   Run `composer update ultracart/rest_api_v2_sdk_php` to get a build that
 *   includes them before running the sample.
 */

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;
use ultracart\v2\api\AutoOrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

// --------------------------------------------------------------------
// Configuration
// --------------------------------------------------------------------
$order_id = $argv[1] ?? 'DEMO-0009104976';

$order_api      = OrderApi::usingApiKey(Constants::API_KEY, false, false);
$auto_order_api = AutoOrderApi::usingApiKey(Constants::API_KEY, false, false);

// Listing expansions individually (rather than relying on a catch-all) keeps
// payload size predictable and makes it obvious what evidence each piece is
// providing. Add or remove based on what your dispute reason code requires.
$order_expansion = implode(',', [
    'billing',                 // address customer entered for billing
    'shipping',                // address goods shipped to
    'payment',                 // payment method, card last four, gateway info
    'payment.transaction',     // auth/capture/refund timeline
    'summary',                 // totals, tax, shipping, weights
    'items',                   // line items the customer ordered
    'coupon',                  // discounts the customer chose to apply
    'customer_profile',        // returning-customer signal, account history
    'auto_order',              // detect subscription chargebacks
    'utms',                    // entry-path UTM clicks (attribution chain)
    'marketing',               // affiliate / source-code attribution
    'gift',                    // gift-giving intent if applicable
    'point_of_sale',           // POS terminal / location for retail orders
    'channel_partner',         // channel partner data (Amazon, eBay, etc.)
]);

$auto_order_expansion = implode(',', [
    'items',                   // subscription line items + frequency
    'rebill_orders',           // every rebill that has occurred
    'logs',                    // status changes, payment attempts, cancellations
    'management',              // self-service management state
]);

// --------------------------------------------------------------------
// Pull the data
// --------------------------------------------------------------------
$order_response = $order_api->getOrder($order_id, $order_expansion);
if ($order_response->getError() !== null) {
    fail('getOrder', $order_response->getError());
}
$order = $order_response->getOrder();

$emails_response = $order_api->getOrderEmails($order_id);
if ($emails_response->getError() !== null) {
    fail('getOrderEmails', $emails_response->getError());
}
$emails = $emails_response->getEmails() ?? [];

// Auto-order chain (if applicable). Resolve this BEFORE pulling page views
// because a rebill's own page view history is empty - the customer never
// went through checkout for the rebill, so the meaningful history lives
// on the original order that started the subscription.
$auto_order         = null;
$auto_order_emails  = [];
$rebill_orders      = [];
$auto_order_pointer = $order->getAutoOrder();   // populated by ?_expand=auto_order
if ($auto_order_pointer !== null && $auto_order_pointer->getAutoOrderOid() !== null) {
    $auto_order_oid = $auto_order_pointer->getAutoOrderOid();

    $ao_response = $auto_order_api->getAutoOrder($auto_order_oid, $auto_order_expansion);
    if ($ao_response->getError() !== null) {
        fail('getAutoOrder', $ao_response->getError());
    }
    $auto_order    = $ao_response->getAutoOrder();
    $rebill_orders = $auto_order->getRebillOrders() ?? [];

    $ao_emails_response = $auto_order_api->getAutoOrderEmails($auto_order_oid);
    if ($ao_emails_response->getError() !== null) {
        fail('getAutoOrderEmails', $ao_emails_response->getError());
    }
    $auto_order_emails = $ao_emails_response->getEmails() ?? [];
}

// For a rebill chargeback, the page view history that matters is the one
// from the ORIGINAL order's checkout session. Rebills are charged
// automatically; the customer's intent and journey were captured at signup.
$page_view_order_id     = $order_id;
$page_view_is_redirected = false;
if ($auto_order !== null) {
    $original_order_id = $auto_order->getOriginalOrderId();
    if ($original_order_id !== null && strcasecmp($original_order_id, $order_id) !== 0) {
        $page_view_order_id      = $original_order_id;
        $page_view_is_redirected = true;
    }
}

$page_view_response = $order_api->getOrderPageViewHistory($page_view_order_id);
if ($page_view_response->getError() !== null) {
    fail('getOrderPageViewHistory', $page_view_response->getError());
}
$page_views       = $page_view_response->getPageViews() ?? [];
$session_referrer = $page_view_response->getReferrer();

// --------------------------------------------------------------------
// Render the report
// --------------------------------------------------------------------
$is_cli = (php_sapi_name() === 'cli');
if (!$is_cli) echo '<html lang="en"><body><pre>';

renderHeader($order_id);
renderOrderOverview($order);
renderSubscription($auto_order, $rebill_orders, $order_id, $auto_order_emails);
renderEmails($emails);
renderPageViewHistory($page_views, $session_referrer, $page_view_order_id, $page_view_is_redirected);
renderFooter();

if (!$is_cli) echo '</pre></body></html>';


// =====================================================================
// Render helpers
// =====================================================================

function renderHeader(string $order_id): void {
    hr('=');
    echo "  CHARGEBACK EVIDENCE REPORT\n";
    echo "  UltraCart REST API v2\n";
    hr('=');
    echo "\n";
    kv('Order ID',  $order_id);
    kv('Generated', gmdate('Y-m-d\TH:i:s\Z'));
    echo "\n";
}

function renderOrderOverview($order): void {
    section('1. ORDER OVERVIEW');

    kv('Placed',       $order->getCreationDts());
    kv('Stage',        $order->getCurrentStage());
    kv('Currency',     $order->getCurrencyCode());

    $summary = $order->getSummary();
    if ($summary !== null) {
        kv('Order Total', money($summary->getTotal(), $order->getCurrencyCode()));
    }

    // Customer
    subsection('Customer');
    $billing = $order->getBilling();
    if ($billing !== null) {
        kv('Name',  trim(($billing->getFirstName() ?? '') . ' ' . ($billing->getLastName() ?? '')));
        kv('Email', $billing->getEmail());
        kv('Phone', $billing->getPhone());
    }
    $cp = $order->getCustomerProfile();
    if ($cp !== null) {
        kv('Customer Profile', 'yes (oid ' . ($cp->getCustomerProfileOid() ?? '?') . ')');
    } else {
        kv('Customer Profile', 'no (guest checkout)');
    }
    $marketing = $order->getMarketing();
    if ($marketing !== null && $marketing->getOriginalSourceCode() !== null) {
        kv('Original Source', $marketing->getOriginalSourceCode());
    }

    // Addresses
    subsection('Billing Address');
    renderAddress($billing);

    subsection('Shipping Address');
    renderAddress($order->getShipping());

    // Items - skip kit components (they're sub-rows of a parent kit, not
    // independently-purchased items, and printing them inflates the list).
    subsection('Items');
    $items = $order->getItems() ?? [];
    foreach ($items as $item) {
        if ($item->getKitComponent()) {
            continue;
        }
        $sku   = $item->getMerchantItemId() ?? '';
        $desc  = $item->getDescription() ?? '';
        $qty   = $item->getQuantity() ?? 0;
        $cost  = $item->getCost() ?? 0;
        $total = $qty * $cost;
        echo sprintf(
            "  %-12s %-32s qty %s @ %s = %s\n",
            shorten($sku, 12),
            shorten($desc, 32),
            $qty,
            money($cost, $order->getCurrencyCode()),
            money($total, $order->getCurrencyCode())
        );
    }

    // Totals
    if ($summary !== null) {
        echo "\n";
        kv('Subtotal', money($summary->getSubtotal(), $order->getCurrencyCode()));
        if ($summary->getTax() !== null)             kv('Tax',      money($summary->getTax(), $order->getCurrencyCode()));
        if ($summary->getShippingHandling() !== null) kv('Shipping', money($summary->getShippingHandling(), $order->getCurrencyCode()));
        kv('Total', money($summary->getTotal(), $order->getCurrencyCode()));
    }

    // Payment
    subsection('Payment');
    $payment = $order->getPayment();
    if ($payment !== null) {
        kv('Method', $payment->getPaymentMethod());
        $cc = $payment->getCreditCard();
        if ($cc !== null) {
            $card_summary = trim(
                ($cc->getCardType() ?? '') . ' ending ' . ($cc->getCardNumberTruncated() ?? '????')
            );
            kv('Card', $card_summary);
        }
        $transactions = $payment->getTransactions() ?? [];
        if (!empty($transactions)) {
            subsection('Transactions');
            foreach ($transactions as $tx) {
                echo sprintf(
                    "  %-21s %-12s %-12s %s\n",
                    $tx->getDts() ?? '',
                    $tx->getTransactionType() ?? '',
                    money($tx->getAmount(), $order->getCurrencyCode()),
                    $tx->getSuccessful() ? 'approved' : 'failed'
                );
            }
        }
    }

    // Marketing attribution
    subsection('Marketing / Attribution');
    $utms = $order->getUtms() ?? [];
    if ($marketing !== null) {
        kv('Affiliate ID', $marketing->getAffiliateId() ?? '(none)');
    }
    if (empty($utms)) {
        echo "  No UTM clicks captured.\n";
    } else {
        // Index 0 is the most recent click per the API doc.
        $most_recent = $utms[0];
        kv('Most recent UTM source',   $most_recent->getUtmSource());
        kv('Most recent UTM medium',   $most_recent->getUtmMedium());
        kv('Most recent UTM campaign', $most_recent->getUtmCampaign());
        kv('UTM clicks captured', (string) count($utms));
    }
    echo "\n";
}

function renderSubscription($auto_order, array $rebill_orders, string $current_order_id, array $auto_order_emails): void {
    section('2. SUBSCRIPTION DETAILS');

    if ($auto_order === null) {
        echo "  This order is NOT part of an auto order subscription.\n";
        echo "\n";
        return;
    }

    echo "  This order IS part of an auto order subscription.\n\n";
    kv('Auto Order Code',     $auto_order->getAutoOrderCode());
    kv('Status',              $auto_order->getStatus());
    kv('Enabled',             $auto_order->getEnabled() ? 'yes' : 'no');
    kv('Original Order',      $auto_order->getOriginalOrderId());
    kv('Next Attempt',        $auto_order->getNextAttempt() ?? '(none scheduled)');
    if ($auto_order->getCanceledDts() !== null) {
        kv('Canceled',          $auto_order->getCanceledDts());
        kv('Canceled By',       $auto_order->getCanceledByUser() ?? '');
        kv('Cancel Reason',     $auto_order->getCancelReason() ?? '');
    }
    kv('Total Rebills',       (string) count($rebill_orders));

    // Items in plan
    $ao_items = $auto_order->getItems() ?? [];
    if (!empty($ao_items)) {
        subsection('Items in Subscription');
        foreach ($ao_items as $aoi) {
            echo sprintf(
                "  %-12s %-32s frequency: %s\n",
                shorten($aoi->getOriginalItemId() ?? '', 12),
                shorten($aoi->getOriginalItemId() ?? '', 32),
                $aoi->getFrequency() ?? ''
            );
        }
    }

    // Rebill timeline
    if (!empty($rebill_orders)) {
        subsection('Rebill Timeline');
        // Sort by creation date ascending so the earliest rebill is at the top.
        usort($rebill_orders, function ($a, $b) {
            return strcmp($a->getCreationDts() ?? '', $b->getCreationDts() ?? '');
        });
        foreach ($rebill_orders as $ro) {
            $ro_id     = $ro->getOrderId() ?? '';
            $marker    = strcasecmp($ro_id, $current_order_id) === 0 ? '  *** THIS ORDER' : '';
            $ro_summary = $ro->getSummary();
            $ro_total   = $ro_summary !== null
                ? money($ro_summary->getTotal(), $ro->getCurrencyCode() ?? 'USD')
                : '';
            echo sprintf(
                "  %-22s %-22s %-10s %s%s\n",
                $ro->getCreationDts() ?? '',
                $ro_id,
                $ro_total,
                $ro->getCurrentStage() ?? '',
                $marker
            );
        }
    }

    // Auto-order-level emails (subscription confirmations, upcoming-rebill notices)
    if (!empty($auto_order_emails)) {
        subsection('Subscription-Level Emails (' . count($auto_order_emails) . ')');
        $i = 1;
        foreach ($auto_order_emails as $email) {
            renderEmailDetail($i, $email);
            $i++;
        }
    } else {
        subsection('Subscription-Level Emails');
        echo "  No subscription-level emails on record.\n";
    }
    echo "\n";
}

function renderEmails(array $emails): void {
    section('3. EMAIL DELIVERY (' . count($emails) . ' messages)');

    if (empty($emails)) {
        echo "  No email delivery records on file for this order.\n";
        echo "\n";
        return;
    }

    $i = 1;
    foreach ($emails as $email) {
        renderEmailDetail($i, $email);
        $i++;
    }
    echo "\n";
}

function renderEmailDetail(int $i, $email): void {
    echo sprintf("  [%d] sent %s%s\n", $i, $email->getSendDts() ?? '?', $email->getInternal() ? '   (internal copy)' : '');
    echo sprintf("      To:               %s\n", $email->getEmail() ?? '');
    echo sprintf("      Subject:          %s\n", $email->getSubject() ?? '');

    // Build a status line that captures the most informative state.
    $states = [];
    if ($email->getDelivered())             $states[] = 'DELIVERED';
    if ($email->getSkipped())               $states[] = 'SKIPPED';
    if ($email->getBounceDts() !== null)    $states[] = 'BOUNCED ' . $email->getBounceDts();
    if ($email->getOpened())                $states[] = 'OPENED ' . ($email->getOpenedDts() ?? '');
    if ($email->getClicked())               $states[] = 'CLICKED ' . ($email->getClickedDts() ?? '');
    echo sprintf("      Status:           %s\n", empty($states) ? 'unknown' : implode(', ', $states));

    if ($email->getDeliveryDts() !== null)
        echo sprintf("      Delivered:        %s\n", $email->getDeliveryDts());
    if ($email->getReportingMTA() !== null)
        echo sprintf("      Reporting MTA:    %s\n", $email->getReportingMTA());
    if ($email->getSmtpResponse() !== null)
        echo sprintf("      SMTP response:    %s\n", $email->getSmtpResponse());
    if ($email->getBounceType() !== null)
        echo sprintf("      Bounce type:      %s / %s\n", $email->getBounceType(), $email->getBounceSubType() ?? '');
    if ($email->getBounceDiagnosticCode() !== null)
        echo sprintf("      Diagnostic:       %s\n", $email->getBounceDiagnosticCode());
    if ($email->getSkipReason() !== null)
        echo sprintf("      Skip reason:      %s\n", $email->getSkipReason());
    echo "\n";
}

function renderPageViewHistory(array $page_views, ?string $session_referrer, string $source_order_id, bool $is_redirected): void {
    section('4. PAGE VIEW HISTORY (' . count($page_views) . ' views)');

    if ($is_redirected) {
        echo "  Note: this is a subscription rebill. The disputed order itself has no\n";
        echo "  checkout session of its own. The page views below are from the ORIGINAL\n";
        echo "  order that started the subscription, where the customer's intent was\n";
        echo "  captured during signup.\n\n";
        kv('Source order',     $source_order_id);
    }
    kv('Session referrer', $session_referrer ?? '(direct or unknown)');

    if (empty($page_views)) {
        echo "\n  No page views captured" . ($is_redirected ? ' for the original order.' : " for this order's session.") . "\n";
        echo "\n";
        return;
    }

    subsection('Timeline');
    foreach ($page_views as $pv) {
        $top   = $pv->getTimeOnPage();
        $top_s = $top === null ? '   -' : sprintf('%4ds', $top);
        echo sprintf(
            "  %-22s %s   %s\n",
            $pv->getViewDts() ?? '',
            $top_s,
            $pv->getUrl() ?? ''
        );
    }

    // Time-to-purchase: from first page view to last
    if (count($page_views) >= 2) {
        $first_ts = strtotime($page_views[0]->getViewDts() ?? '');
        $last_ts  = strtotime($page_views[count($page_views) - 1]->getViewDts() ?? '');
        if ($first_ts && $last_ts && $last_ts > $first_ts) {
            $elapsed = $last_ts - $first_ts;
            $mins    = intdiv($elapsed, 60);
            $secs    = $elapsed % 60;
            echo "\n";
            kv('Session length', sprintf('%dm %ds (first view to last view)', $mins, $secs));
        }
    }

    // Unique URLs
    $unique = [];
    foreach ($page_views as $pv) {
        $unique[$pv->getUrl() ?? ''] = true;
    }
    kv('Unique URLs visited', (string) count($unique));
    echo "\n";
}

function renderAddress($address): void {
    if ($address === null) {
        echo "  (none on file)\n";
        return;
    }

    $name    = trim(($address->getFirstName() ?? '') . ' ' . ($address->getLastName() ?? ''));
    $company = $address->getCompany() ?? '';
    $line1   = $address->getAddress1() ?? '';
    $line2   = $address->getAddress2() ?? '';
    $cityRow = trim(
        ($address->getCity() ?? '') .
        (($address->getState() ?? null) !== null ? ', ' . $address->getState() : '') .
        ' ' . ($address->getPostalCode() ?? '')
    );
    $country = $address->getCountryCode() ?? '';

    foreach (array_filter([$name, $company, $line1, $line2, $cityRow, $country], 'strlen') as $line) {
        echo "  $line\n";
    }
}

function renderFooter(): void {
    hr('=');
    echo "  END OF EVIDENCE REPORT\n";
    hr('=');
}

// =====================================================================
// Tiny formatting primitives
// =====================================================================

function hr(string $char): void {
    echo str_repeat($char, 80) . "\n";
}

function section(string $title): void {
    echo "\n";
    hr('=');
    echo "  $title\n";
    hr('=');
    echo "\n";
}

function subsection(string $title): void {
    echo "\n  $title\n";
    echo '  ' . str_repeat('-', strlen($title)) . "\n";
}

function kv(string $label, ?string $value): void {
    echo sprintf("  %-22s %s\n", $label . ':', $value ?? '');
}

function money(?float $amount, ?string $currency): string {
    if ($amount === null) return '';
    return sprintf('%s%s %s', $amount < 0 ? '-' : '', '$' . number_format(abs($amount), 2), $currency ?? '');
}

function shorten(string $s, int $max): string {
    return mb_strlen($s) <= $max ? $s : mb_substr($s, 0, $max - 1) . '~';
}

function fail(string $operation, $error): void {
    echo "ERROR in $operation:\n";
    echo "  Developer message: " . ($error->getDeveloperMessage() ?? '') . "\n";
    echo "  User message:      " . ($error->getUserMessage() ?? '') . "\n";
    exit(1);
}
