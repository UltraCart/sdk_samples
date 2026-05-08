import { orderApi, autoOrderApi } from '../api.js';

/**
 * getChargebackEvidence
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
 *   2. Email delivery records via the dedicated /emails endpoint (not via
 *      expansion). Use the dedicated endpoint for chargeback work - it is the
 *      canonical full-fidelity source for SES delivery events on every order.
 *   3. Page view history (the customer was on your site, navigated through
 *      pages, spent time before placing the order).
 *   4. Auto-order detection: a large fraction of chargebacks are subscription
 *      disputes. When the order is part of an auto order, the sample pulls
 *      the parent subscription, every rebill, and the auto-order-level email
 *      log. For rebills specifically, the page-view lookup pivots to the
 *      ORIGINAL order (the rebill itself has no checkout session).
 *
 * Run:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 node order/getChargebackEvidence.js DEMO-0009104976
 *
 * Requires the May 2026 SDK build with getOrderEmails,
 * getOrderPageViewHistory, and getAutoOrderEmails.
 */
export async function execute() {
    const orderId = process.argv[2] || 'DEMO-0009104976';

    const orderExpansion = [
        'billing', 'shipping', 'payment', 'payment.transaction', 'summary',
        'items', 'coupon', 'customer_profile', 'auto_order', 'utms',
        'marketing', 'gift', 'point_of_sale', 'channel_partner',
    ].join(',');

    const autoOrderExpansion = ['items', 'rebill_orders', 'logs', 'management'].join(',');

    const promisify = (fn) => new Promise((resolve, reject) => {
        fn((error, data /*, response */) => error ? reject(error) : resolve(data));
    });

    try {
        const orderResponse = await promisify(cb => orderApi.getOrder(orderId, { _expand: orderExpansion }, cb));
        if (orderResponse.error) failOp('getOrder', orderResponse.error);
        const order = orderResponse.order;

        // Use the dedicated /emails endpoint rather than _expand=emails. The
        // dedicated endpoint is the canonical full-fidelity source for SES
        // delivery events.
        const emailsResponse = await promisify(cb => orderApi.getOrderEmails(orderId, cb));
        if (emailsResponse.error) failOp('getOrderEmails', emailsResponse.error);
        const emails = emailsResponse.emails || [];

        // Auto-order chain BEFORE page views: a rebill's own page view history
        // is empty - the meaningful history lives on the original order.
        let autoOrder = null;
        let autoOrderEmails = [];
        let rebillOrders = [];
        const autoOrderPointer = order.auto_order;
        if (autoOrderPointer && autoOrderPointer.auto_order_oid) {
            const autoOrderOid = autoOrderPointer.auto_order_oid;

            const aoResponse = await promisify(cb => autoOrderApi.getAutoOrder(autoOrderOid, { _expand: autoOrderExpansion }, cb));
            if (aoResponse.error) failOp('getAutoOrder', aoResponse.error);
            autoOrder = aoResponse.auto_order;
            rebillOrders = autoOrder.rebill_orders || [];

            const aoEmailsResponse = await promisify(cb => autoOrderApi.getAutoOrderEmails(autoOrderOid, cb));
            if (aoEmailsResponse.error) failOp('getAutoOrderEmails', aoEmailsResponse.error);
            autoOrderEmails = aoEmailsResponse.emails || [];
        }

        let pageViewOrderId = orderId;
        let pageViewIsRedirected = false;
        if (autoOrder &&
            autoOrder.original_order_id &&
            autoOrder.original_order_id.toLowerCase() !== orderId.toLowerCase()) {
            pageViewOrderId = autoOrder.original_order_id;
            pageViewIsRedirected = true;
        }

        const pageViewResponse = await promisify(cb => orderApi.getOrderPageViewHistory(pageViewOrderId, cb));
        if (pageViewResponse.error) failOp('getOrderPageViewHistory', pageViewResponse.error);
        const pageViews = pageViewResponse.page_views || [];
        const sessionReferrer = pageViewResponse.referrer;

        renderHeader(orderId);
        renderOrderOverview(order);
        renderSubscription(autoOrder, rebillOrders, orderId, autoOrderEmails);
        renderEmails(emails);
        renderPageViewHistory(pageViews, sessionReferrer, pageViewOrderId, pageViewIsRedirected);
        renderFooter();
    } catch (error) {
        console.error('Error gathering chargeback evidence:', error);
        process.exit(1);
    }
}

// =====================================================================
// Render helpers
// =====================================================================

function renderHeader(orderId) {
    hr('=');
    console.log('  CHARGEBACK EVIDENCE REPORT');
    console.log('  UltraCart REST API v2');
    hr('=');
    console.log();
    kv('Order ID',  orderId);
    kv('Generated', new Date().toISOString());
}

function renderOrderOverview(order) {
    section('1. ORDER OVERVIEW');

    kv('Placed',   order.creation_dts);
    kv('Stage',    order.current_stage);
    kv('Currency', order.currency_code);
    if (order.summary) kv('Order Total', money(moneyValue(order.summary.total), order.currency_code));

    subsection('Customer');
    const billing = order.billing;
    if (billing) {
        kv('Name',  [billing.first_name, billing.last_name].filter(Boolean).join(' ').trim());
        kv('Email', billing.email);
        // First populated phone wins
        kv('Phone', billing.day_phone || billing.evening_phone || billing.cell_phone);
    }
    const cp = order.customer_profile;
    kv('Customer Profile', cp ? `yes (oid ${cp.customer_profile_oid || '?'})` : 'no (guest checkout)');
    const marketing = order.marketing;
    if (marketing && marketing.advertising_source) kv('Advertising Source', marketing.advertising_source);
    if (marketing && marketing.referral_code) kv('Referral Code', marketing.referral_code);

    subsection('Billing Address');
    renderAddress(billing);

    subsection('Shipping Address');
    renderAddress(order.shipping);

    subsection('Items');
    for (const item of (order.items || [])) {
        if (item.kit_component) continue; // skip kit components - sub-rows of a parent kit
        const qty  = item.quantity || 0;
        const cost = moneyValue(item.cost) || 0; // OrderItem.cost is a Currency object
        console.log(
            '  ' + pad(shorten(item.merchant_item_id || '', 12), 12) + ' ' +
            pad(shorten(item.description || '', 32), 32) +
            ` qty ${qty} @ ${money(cost, order.currency_code)} = ${money(qty * cost, order.currency_code)}`
        );
    }

    if (order.summary) {
        console.log();
        kv('Subtotal', money(moneyValue(order.summary.subtotal), order.currency_code));
        if (order.summary.tax)                     kv('Tax',      money(moneyValue(order.summary.tax), order.currency_code));
        if (order.summary.shipping_handling_total) kv('Shipping', money(moneyValue(order.summary.shipping_handling_total), order.currency_code));
        kv('Total',    money(moneyValue(order.summary.total), order.currency_code));
    }

    subsection('Payment');
    const payment = order.payment;
    if (payment) {
        kv('Method', payment.payment_method);
        const cc = payment.credit_card;
        if (cc) kv('Card', `${cc.card_type || ''} ending ${cc.card_number_truncated || '????'}`.trim());
        const transactions = payment.transactions || [];
        if (transactions.length) {
            subsection('Transactions');
            for (const tx of transactions) {
                console.log(
                    '  ' + pad(tx.transaction_timestamp || '', 21) + ' ' +
                    pad(shorten(tx.transaction_gateway || '', 30), 30) + ' ' +
                    (tx.successful ? 'approved' : 'failed')
                );
            }
        }
    }

    subsection('Marketing / Attribution');
    const utms = order.utms || [];
    // Affiliate attribution lives on OrderAffiliate (expansion=affiliate); not pulled
    // here to keep the chargeback request light.
    if (utms.length === 0) {
        console.log('  No UTM clicks captured.');
    } else {
        const mostRecent = utms[0]; // index 0 is most recent click
        kv('Most recent UTM source',   mostRecent.utm_source);
        kv('Most recent UTM medium',   mostRecent.utm_medium);
        kv('Most recent UTM campaign', mostRecent.utm_campaign);
        kv('UTM clicks captured', String(utms.length));
    }
}

function renderSubscription(autoOrder, rebillOrders, currentOrderId, autoOrderEmails) {
    section('2. SUBSCRIPTION DETAILS');

    if (!autoOrder) {
        console.log('  This order is NOT part of an auto order subscription.');
        return;
    }

    console.log('  This order IS part of an auto order subscription.');
    console.log();
    kv('Auto Order Code', autoOrder.auto_order_code);
    kv('Status',          autoOrder.status);
    kv('Enabled',         autoOrder.enabled ? 'yes' : 'no');
    kv('Original Order',  autoOrder.original_order_id);
    kv('Next Attempt',    autoOrder.next_attempt || '(none scheduled)');
    if (autoOrder.canceled_dts) {
        kv('Canceled',      autoOrder.canceled_dts);
        kv('Canceled By',   autoOrder.canceled_by_user || '');
        kv('Cancel Reason', autoOrder.cancel_reason || '');
    }
    kv('Total Rebills', String(rebillOrders.length));

    const aoItems = autoOrder.items || [];
    if (aoItems.length) {
        subsection('Items in Subscription');
        for (const aoi of aoItems) {
            console.log(
                '  ' + pad(shorten(aoi.original_item_id || '', 12), 12) + ' ' +
                pad(shorten(aoi.original_item_id || '', 32), 32) +
                ` frequency: ${aoi.frequency || ''}`
            );
        }
    }

    if (rebillOrders.length) {
        subsection('Rebill Timeline');
        rebillOrders.sort((a, b) => (a.creation_dts || '').localeCompare(b.creation_dts || ''));
        for (const ro of rebillOrders) {
            const roId    = ro.order_id || '';
            const marker  = roId.toLowerCase() === currentOrderId.toLowerCase() ? '  *** THIS ORDER' : '';
            const roTotal = ro.summary ? money(moneyValue(ro.summary.total), ro.currency_code || 'USD') : '';
            console.log(
                '  ' + pad(ro.creation_dts || '', 22) + ' ' +
                pad(roId, 22) + ' ' +
                pad(roTotal, 10) + ' ' +
                (ro.current_stage || '') + marker
            );
        }
    }

    if (autoOrderEmails.length) {
        subsection(`Subscription-Level Emails (${autoOrderEmails.length})`);
        autoOrderEmails.forEach((email, i) => renderEmailDetail(i + 1, email));
    } else {
        subsection('Subscription-Level Emails');
        console.log('  No subscription-level emails on record.');
    }
}

function renderEmails(emails) {
    section(`3. EMAIL DELIVERY (${emails.length} messages)`);
    if (emails.length === 0) {
        console.log('  No email delivery records on file for this order.');
        return;
    }
    emails.forEach((email, i) => renderEmailDetail(i + 1, email));
}

function renderEmailDetail(i, email) {
    const internal = email.internal ? '   (internal copy)' : '';
    console.log(`  [${i}] sent ${email.send_dts || '?'}${internal}`);
    console.log(`      To:               ${email.email || ''}`);
    console.log(`      Subject:          ${email.subject || ''}`);

    const states = [];
    if (email.delivered)               states.push('DELIVERED');
    if (email.skipped)                 states.push('SKIPPED');
    if (email.bounce_dts)              states.push(`BOUNCED ${email.bounce_dts}`);
    if (email.opened)                  states.push(`OPENED ${email.opened_dts || ''}`);
    if (email.clicked)                 states.push(`CLICKED ${email.clicked_dts || ''}`);
    console.log(`      Status:           ${states.length ? states.join(', ') : 'unknown'}`);

    if (email.delivery_dts)            console.log(`      Delivered:        ${email.delivery_dts}`);
    if (email.reporting_mta)           console.log(`      Reporting MTA:    ${email.reporting_mta}`);
    if (email.smtp_response)           console.log(`      SMTP response:    ${email.smtp_response}`);
    if (email.bounce_type)             console.log(`      Bounce type:      ${email.bounce_type} / ${email.bounce_sub_type || ''}`);
    if (email.bounce_diagnostic_code)  console.log(`      Diagnostic:       ${email.bounce_diagnostic_code}`);
    if (email.skip_reason)             console.log(`      Skip reason:      ${email.skip_reason}`);
    console.log();
}

function renderPageViewHistory(pageViews, sessionReferrer, sourceOrderId, isRedirected) {
    section(`4. PAGE VIEW HISTORY (${pageViews.length} views)`);
    if (isRedirected) {
        console.log("  Note: this is a subscription rebill. The disputed order itself has no");
        console.log("  checkout session of its own. The page views below are from the ORIGINAL");
        console.log("  order that started the subscription, where the customer's intent was");
        console.log("  captured during signup.");
        console.log();
        kv('Source order', sourceOrderId);
    }
    kv('Session referrer', sessionReferrer || '(direct or unknown)');

    if (pageViews.length === 0) {
        console.log();
        console.log(`  No page views captured${isRedirected ? ' for the original order.' : " for this order's session."}`);
        return;
    }

    subsection('Timeline');
    for (const pv of pageViews) {
        const top  = pv.time_on_page;
        const tops = top === null || top === undefined ? '   -' : String(top).padStart(4, ' ') + 's';
        console.log(`  ${pad(pv.view_dts || '', 22)} ${tops}   ${pv.url || ''}`);
    }

    if (pageViews.length >= 2) {
        const first = Date.parse(pageViews[0].view_dts || '');
        const last  = Date.parse(pageViews[pageViews.length - 1].view_dts || '');
        if (!isNaN(first) && !isNaN(last) && last > first) {
            const elapsed = Math.floor((last - first) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            console.log();
            kv('Session length', `${mins}m ${secs}s (first view to last view)`);
        }
    }

    const uniqueUrls = new Set(pageViews.map(pv => pv.url).filter(Boolean));
    kv('Unique URLs visited', String(uniqueUrls.size));
}

function renderAddress(address) {
    if (!address) { console.log('  (none on file)'); return; }
    const name    = [address.first_name, address.last_name].filter(Boolean).join(' ').trim();
    const cityRow = (
        (address.city || '') +
        (address.state_region ? `, ${address.state_region}` : '') +
        ' ' + (address.postal_code || '')
    ).trim();
    [name, address.company, address.address1, address.address2, cityRow, address.country_code]
        .filter(line => line && line.trim().length > 0)
        .forEach(line => console.log(`  ${line}`));
}

function renderFooter() {
    console.log();
    hr('=');
    console.log('  END OF EVIDENCE REPORT');
    hr('=');
}

// =====================================================================
// Tiny formatting primitives
// =====================================================================
function hr(char) { console.log(char.repeat(80)); }
function section(title)    { console.log(); hr('='); console.log(`  ${title}`); hr('='); console.log(); }
function subsection(title) { console.log(); console.log(`  ${title}`); console.log('  ' + '-'.repeat(title.length)); }
function kv(label, value, width = 22) {
    console.log(`  ${(label + ':').padEnd(width)} ${value === null || value === undefined ? '' : value}`);
}
function pad(s, n) { s = s == null ? '' : String(s); return s.length >= n ? s : s + ' '.repeat(n - s.length); }
function shorten(s, n) { s = s == null ? '' : String(s); return s.length <= n ? s : s.substring(0, n - 1) + '~'; }

// SDK money fields are Currency objects, not raw numbers. Pull the localized
// value off; null-safe for missing/optional fields.
function moneyValue(currency) {
    if (currency === null || currency === undefined) return undefined;
    return currency.localized;
}
function money(amount, currency) {
    if (amount === null || amount === undefined) return '';
    const sign = amount < 0 ? '-' : '';
    return `${sign}$${Math.abs(amount).toFixed(2)} ${currency || ''}`.trim();
}

function failOp(operation, error) {
    console.error(`ERROR in ${operation}:`);
    console.error(`  Developer message: ${error.developer_message || ''}`);
    console.error(`  User message:      ${error.user_message      || ''}`);
    process.exit(1);
}
