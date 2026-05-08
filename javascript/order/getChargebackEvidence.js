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
 *      disputes. When the order is part of an auto order, this sample pulls
 *      the parent subscription, every rebill that has occurred on it, and the
 *      auto-order-level email log. For rebills specifically, the page-view
 *      lookup pivots to the ORIGINAL order (the rebill itself has no checkout
 *      session).
 *
 * Run:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 node order/getChargebackEvidence.js DEMO-0009104976
 *
 * Requires the May 2026 SDK build with getOrderEmails,
 * getOrderPageViewHistory, and getAutoOrderEmails.
 */
export async function execute() {
    const orderId = process.argv[2] || 'DEMO-0009104976';

    // Listing expansions individually (rather than relying on a catch-all) keeps
    // payload size predictable and makes it obvious what evidence each piece is
    // providing. Add or remove based on what your dispute reason code requires.
    const orderExpansion = [
        'billing',                  // address customer entered for billing
        'shipping',                 // address goods shipped to
        'payment',                  // payment method, card last four, gateway info
        'payment.transaction',      // auth/capture/refund timeline
        'summary',                  // totals, tax, shipping, weights
        'items',                    // line items the customer ordered
        'coupon',                   // discounts the customer chose to apply
        'customer_profile',         // returning-customer signal, account history
        'auto_order',               // detect subscription chargebacks
        'utms',                     // entry-path UTM clicks (attribution chain)
        'marketing',                // affiliate / source-code attribution
        'gift',                     // gift-giving intent if applicable
        'point_of_sale',            // POS terminal / location for retail orders
        'channel_partner',          // channel partner data
    ].join(',');

    const autoOrderExpansion = [
        'items',                    // subscription line items + frequency
        'rebill_orders',            // every rebill that has occurred
        'logs',                     // status changes, payment attempts, cancellations
        'management',               // self-service management state
    ].join(',');

    // Tiny callback->promise wrapper - keeps the read flow linear below.
    const promisify = (fn) => new Promise((resolve, reject) => {
        fn((error, data /*, response */) => error ? reject(error) : resolve(data));
    });

    try {
        // Order detail
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
        // is empty - the customer never went through checkout for the rebill.
        let autoOrder = null;
        let autoOrderEmails = [];
        let rebillOrders = [];
        const autoOrderPointer = order.autoOrder; // populated by ?_expand=auto_order
        if (autoOrderPointer && autoOrderPointer.autoOrderOid) {
            const autoOrderOid = autoOrderPointer.autoOrderOid;

            const aoResponse = await promisify(cb => autoOrderApi.getAutoOrder(autoOrderOid, { _expand: autoOrderExpansion }, cb));
            if (aoResponse.error) failOp('getAutoOrder', aoResponse.error);
            autoOrder = aoResponse.autoOrder;
            rebillOrders = autoOrder.rebillOrders || [];

            const aoEmailsResponse = await promisify(cb => autoOrderApi.getAutoOrderEmails(autoOrderOid, cb));
            if (aoEmailsResponse.error) failOp('getAutoOrderEmails', aoEmailsResponse.error);
            autoOrderEmails = aoEmailsResponse.emails || [];
        }

        // For a rebill chargeback, page views live on the ORIGINAL order.
        let pageViewOrderId = orderId;
        let pageViewIsRedirected = false;
        if (autoOrder &&
            autoOrder.originalOrderId &&
            autoOrder.originalOrderId.toLowerCase() !== orderId.toLowerCase()) {
            pageViewOrderId = autoOrder.originalOrderId;
            pageViewIsRedirected = true;
        }

        const pageViewResponse = await promisify(cb => orderApi.getOrderPageViewHistory(pageViewOrderId, cb));
        if (pageViewResponse.error) failOp('getOrderPageViewHistory', pageViewResponse.error);
        const pageViews = pageViewResponse.pageViews || [];
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

    kv('Placed',   order.creationDts);
    kv('Stage',    order.currentStage);
    kv('Currency', order.currencyCode);
    if (order.summary) kv('Order Total', money(order.summary.total, order.currencyCode));

    subsection('Customer');
    const billing = order.billing;
    if (billing) {
        kv('Name',  [billing.firstName, billing.lastName].filter(Boolean).join(' ').trim());
        kv('Email', billing.email);
        kv('Phone', billing.phone);
    }
    const cp = order.customerProfile;
    kv('Customer Profile', cp ? `yes (oid ${cp.customerProfileOid || '?'})` : 'no (guest checkout)');
    const marketing = order.marketing;
    if (marketing && marketing.originalSourceCode) kv('Original Source', marketing.originalSourceCode);

    subsection('Billing Address');
    renderAddress(billing);

    subsection('Shipping Address');
    renderAddress(order.shipping);

    subsection('Items');
    for (const item of (order.items || [])) {
        if (item.kitComponent) continue; // skip kit components - sub-rows of a parent kit
        const qty  = item.quantity || 0;
        const cost = item.cost || 0;
        console.log(
            '  ' + pad(shorten(item.merchantItemId || '', 12), 12) + ' ' +
            pad(shorten(item.description || '', 32), 32) +
            ` qty ${qty} @ ${money(cost, order.currencyCode)} = ${money(qty * cost, order.currencyCode)}`
        );
    }

    if (order.summary) {
        console.log();
        kv('Subtotal', money(order.summary.subtotal, order.currencyCode));
        if (order.summary.tax !== null && order.summary.tax !== undefined)
            kv('Tax',      money(order.summary.tax, order.currencyCode));
        if (order.summary.shippingHandling !== null && order.summary.shippingHandling !== undefined)
            kv('Shipping', money(order.summary.shippingHandling, order.currencyCode));
        kv('Total',    money(order.summary.total, order.currencyCode));
    }

    subsection('Payment');
    const payment = order.payment;
    if (payment) {
        kv('Method', payment.paymentMethod);
        const cc = payment.creditCard;
        if (cc) kv('Card', `${cc.cardType || ''} ending ${cc.cardNumberTruncated || '????'}`.trim());
        const transactions = payment.transactions || [];
        if (transactions.length) {
            subsection('Transactions');
            for (const tx of transactions) {
                console.log(
                    '  ' + pad(tx.dts || '', 21) + ' ' +
                    pad(tx.transactionType || '', 12) + ' ' +
                    pad(money(tx.amount, order.currencyCode), 12) + ' ' +
                    (tx.successful ? 'approved' : 'failed')
                );
            }
        }
    }

    subsection('Marketing / Attribution');
    const utms = order.utms || [];
    if (marketing) kv('Affiliate ID', marketing.affiliateId || '(none)');
    if (utms.length === 0) {
        console.log('  No UTM clicks captured.');
    } else {
        const mostRecent = utms[0]; // index 0 is most recent click
        kv('Most recent UTM source',   mostRecent.utmSource);
        kv('Most recent UTM medium',   mostRecent.utmMedium);
        kv('Most recent UTM campaign', mostRecent.utmCampaign);
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
    kv('Auto Order Code', autoOrder.autoOrderCode);
    kv('Status',          autoOrder.status);
    kv('Enabled',         autoOrder.enabled ? 'yes' : 'no');
    kv('Original Order',  autoOrder.originalOrderId);
    kv('Next Attempt',    autoOrder.nextAttempt || '(none scheduled)');
    if (autoOrder.canceledDts) {
        kv('Canceled',      autoOrder.canceledDts);
        kv('Canceled By',   autoOrder.canceledByUser || '');
        kv('Cancel Reason', autoOrder.cancelReason || '');
    }
    kv('Total Rebills', String(rebillOrders.length));

    const aoItems = autoOrder.items || [];
    if (aoItems.length) {
        subsection('Items in Subscription');
        for (const aoi of aoItems) {
            console.log(
                '  ' + pad(shorten(aoi.originalItemId || '', 12), 12) + ' ' +
                pad(shorten(aoi.originalItemId || '', 32), 32) +
                ` frequency: ${aoi.frequency || ''}`
            );
        }
    }

    if (rebillOrders.length) {
        subsection('Rebill Timeline');
        rebillOrders.sort((a, b) => (a.creationDts || '').localeCompare(b.creationDts || ''));
        for (const ro of rebillOrders) {
            const roId    = ro.orderId || '';
            const marker  = roId.toLowerCase() === currentOrderId.toLowerCase() ? '  *** THIS ORDER' : '';
            const roTotal = ro.summary ? money(ro.summary.total, ro.currencyCode || 'USD') : '';
            console.log(
                '  ' + pad(ro.creationDts || '', 22) + ' ' +
                pad(roId, 22) + ' ' +
                pad(roTotal, 10) + ' ' +
                (ro.currentStage || '') + marker
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
    console.log(`  [${i}] sent ${email.sendDts || '?'}${internal}`);
    console.log(`      To:               ${email.email || ''}`);
    console.log(`      Subject:          ${email.subject || ''}`);

    const states = [];
    if (email.delivered)               states.push('DELIVERED');
    if (email.skipped)                 states.push('SKIPPED');
    if (email.bounceDts)               states.push(`BOUNCED ${email.bounceDts}`);
    if (email.opened)                  states.push(`OPENED ${email.openedDts || ''}`);
    if (email.clicked)                 states.push(`CLICKED ${email.clickedDts || ''}`);
    console.log(`      Status:           ${states.length ? states.join(', ') : 'unknown'}`);

    if (email.deliveryDts)           console.log(`      Delivered:        ${email.deliveryDts}`);
    if (email.reportingMta)          console.log(`      Reporting MTA:    ${email.reportingMta}`);
    if (email.smtpResponse)          console.log(`      SMTP response:    ${email.smtpResponse}`);
    if (email.bounceType)            console.log(`      Bounce type:      ${email.bounceType} / ${email.bounceSubType || ''}`);
    if (email.bounceDiagnosticCode)  console.log(`      Diagnostic:       ${email.bounceDiagnosticCode}`);
    if (email.skipReason)            console.log(`      Skip reason:      ${email.skipReason}`);
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
        const top  = pv.timeOnPage;
        const tops = top === null || top === undefined ? '   -' : String(top).padStart(4, ' ') + 's';
        console.log(`  ${pad(pv.viewDts || '', 22)} ${tops}   ${pv.url || ''}`);
    }

    if (pageViews.length >= 2) {
        const first = Date.parse(pageViews[0].viewDts || '');
        const last  = Date.parse(pageViews[pageViews.length - 1].viewDts || '');
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
    const name    = [address.firstName, address.lastName].filter(Boolean).join(' ').trim();
    const cityRow = (
        (address.city || '') +
        (address.state ? `, ${address.state}` : '') +
        ' ' + (address.postalCode || '')
    ).trim();
    [name, address.company, address.address1, address.address2, cityRow, address.countryCode]
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
function money(amount, currency) {
    if (amount === null || amount === undefined) return '';
    const sign = amount < 0 ? '-' : '';
    return `${sign}$${Math.abs(amount).toFixed(2)} ${currency || ''}`.trim();
}

function failOp(operation, error) {
    console.error(`ERROR in ${operation}:`);
    console.error(`  Developer message: ${error.developer_message || error.developerMessage || ''}`);
    console.error(`  User message:      ${error.user_message      || error.userMessage      || ''}`);
    process.exit(1);
}
