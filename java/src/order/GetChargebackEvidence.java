package order;

import com.ultracart.admin.v2.AutoOrderApi;
import com.ultracart.admin.v2.OrderApi;
import com.ultracart.admin.v2.models.*;
import com.ultracart.admin.v2.util.ApiException;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;

/**
 * GetChargebackEvidence
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
 * Requires the May 2026 SDK build with getOrderEmails,
 * getOrderPageViewHistory, and getAutoOrderEmails.
 */
public class GetChargebackEvidence {

    private static final String ORDER_EXPANSION = String.join(",",
        "billing",                  // address customer entered for billing
        "shipping",                 // address goods shipped to
        "payment",                  // payment method, card last four, gateway info
        "payment.transaction",      // auth/capture/refund timeline
        "summary",                  // totals, tax, shipping, weights
        "items",                    // line items the customer ordered
        "coupon",                   // discounts the customer chose to apply
        "customer_profile",         // returning-customer signal, account history
        "auto_order",               // detect subscription chargebacks
        "utms",                     // entry-path UTM clicks (attribution chain)
        "marketing",                // affiliate / source-code attribution
        "gift",                     // gift-giving intent if applicable
        "point_of_sale",            // POS terminal / location for retail orders
        "channel_partner"           // channel partner data
    );

    private static final String AUTO_ORDER_EXPANSION = String.join(",",
        "items",                    // subscription line items + frequency
        "rebill_orders",            // every rebill that has occurred
        "logs",                     // status changes, payment attempts, cancellations
        "management"                // self-service management state
    );

    public void execute() throws ApiException {
        execute("DEMO-0009104976");
    }

    public void execute(String orderId) throws ApiException {
        OrderApi orderApi = new OrderApi(common.Constants.API_KEY);
        AutoOrderApi autoOrderApi = new AutoOrderApi(common.Constants.API_KEY);

        // Order detail
        OrderResponse orderResponse = orderApi.getOrder(orderId, ORDER_EXPANSION);
        if (orderResponse.getError() != null) failOp("getOrder", orderResponse.getError());
        Order order = orderResponse.getOrder();

        // Use the dedicated /emails endpoint rather than _expand=emails. The
        // dedicated endpoint is the canonical full-fidelity source for SES
        // delivery events.
        OrderEmailsResponse emailsResponse = orderApi.getOrderEmails(orderId);
        if (emailsResponse.getError() != null) failOp("getOrderEmails", emailsResponse.getError());
        List<OrderEmail> emails = emailsResponse.getEmails() != null ? emailsResponse.getEmails() : Collections.emptyList();

        // Auto-order chain BEFORE page views: a rebill's own page view history
        // is empty - the meaningful history lives on the original order.
        AutoOrder autoOrder = null;
        List<AutoOrderEmail> autoOrderEmails = Collections.emptyList();
        List<Order> rebillOrders = Collections.emptyList();
        OrderAutoOrder autoOrderPointer = order.getAutoOrder();
        if (autoOrderPointer != null && autoOrderPointer.getAutoOrderOid() != null) {
            int autoOrderOid = autoOrderPointer.getAutoOrderOid();

            AutoOrderResponse aoResponse = autoOrderApi.getAutoOrder(autoOrderOid, AUTO_ORDER_EXPANSION);
            if (aoResponse.getError() != null) failOp("getAutoOrder", aoResponse.getError());
            autoOrder = aoResponse.getAutoOrder();
            rebillOrders = autoOrder.getRebillOrders() != null ? autoOrder.getRebillOrders() : Collections.emptyList();

            AutoOrderEmailsResponse aoEmailsResponse = autoOrderApi.getAutoOrderEmails(autoOrderOid);
            if (aoEmailsResponse.getError() != null) failOp("getAutoOrderEmails", aoEmailsResponse.getError());
            autoOrderEmails = aoEmailsResponse.getEmails() != null ? aoEmailsResponse.getEmails() : Collections.emptyList();
        }

        // For a rebill chargeback, page views live on the ORIGINAL order.
        String pageViewOrderId = orderId;
        boolean pageViewIsRedirected = false;
        if (autoOrder != null
                && autoOrder.getOriginalOrderId() != null
                && !autoOrder.getOriginalOrderId().equalsIgnoreCase(orderId)) {
            pageViewOrderId = autoOrder.getOriginalOrderId();
            pageViewIsRedirected = true;
        }

        OrderPageViewHistoryResponse pageViewResponse = orderApi.getOrderPageViewHistory(pageViewOrderId);
        if (pageViewResponse.getError() != null) failOp("getOrderPageViewHistory", pageViewResponse.getError());
        List<OrderPageView> pageViews = pageViewResponse.getPageViews() != null ? pageViewResponse.getPageViews() : Collections.emptyList();
        String sessionReferrer = pageViewResponse.getReferrer();

        renderHeader(orderId);
        renderOrderOverview(order);
        renderSubscription(autoOrder, rebillOrders, orderId, autoOrderEmails);
        renderEmails(emails);
        renderPageViewHistory(pageViews, sessionReferrer, pageViewOrderId, pageViewIsRedirected);
        renderFooter();
    }

    // =====================================================================
    // Render helpers
    // =====================================================================

    private void renderHeader(String orderId) {
        hr('=');
        System.out.println("  CHARGEBACK EVIDENCE REPORT");
        System.out.println("  UltraCart REST API v2");
        hr('=');
        System.out.println();
        kv("Order ID",  orderId);
        kv("Generated", Instant.now().toString());
    }

    private void renderOrderOverview(Order order) {
        section("1. ORDER OVERVIEW");

        kv("Placed",   order.getCreationDts());
        kv("Stage",    order.getCurrentStage());
        kv("Currency", order.getCurrencyCode());
        if (order.getSummary() != null) kv("Order Total", money(toDouble(moneyValue(order.getSummary().getTotal())), order.getCurrencyCode()));

        subsection("Customer");
        OrderBilling billing = order.getBilling();
        if (billing != null) {
            kv("Name",  joinNonEmpty(" ", billing.getFirstName(), billing.getLastName()));
            kv("Email", billing.getEmail());
            // First populated phone wins
            String phone = billing.getDayPhone() != null ? billing.getDayPhone()
                : billing.getEveningPhone() != null ? billing.getEveningPhone()
                : billing.getCellPhone();
            kv("Phone", phone);
        }
        Customer cp = order.getCustomerProfile();
        kv("Customer Profile", cp != null ? "yes (oid " + (cp.getCustomerProfileOid() != null ? cp.getCustomerProfileOid() : "?") + ")" : "no (guest checkout)");
        OrderMarketing marketing = order.getMarketing();
        if (marketing != null && marketing.getAdvertisingSource() != null) kv("Advertising Source", marketing.getAdvertisingSource());
        if (marketing != null && marketing.getReferralCode() != null)      kv("Referral Code", marketing.getReferralCode());

        subsection("Billing Address");
        renderAddress(billing != null ? billing.getFirstName() : null,
                      billing != null ? billing.getLastName()  : null,
                      billing != null ? billing.getCompany()   : null,
                      billing != null ? billing.getAddress1()  : null,
                      billing != null ? billing.getAddress2()  : null,
                      billing != null ? billing.getCity()      : null,
                      billing != null ? billing.getStateRegion() : null,
                      billing != null ? billing.getPostalCode(): null,
                      billing != null ? billing.getCountryCode() : null);

        OrderShipping shipping = order.getShipping();
        subsection("Shipping Address");
        renderAddress(shipping != null ? shipping.getFirstName() : null,
                      shipping != null ? shipping.getLastName()  : null,
                      shipping != null ? shipping.getCompany()   : null,
                      shipping != null ? shipping.getAddress1()  : null,
                      shipping != null ? shipping.getAddress2()  : null,
                      shipping != null ? shipping.getCity()      : null,
                      shipping != null ? shipping.getStateRegion() : null,
                      shipping != null ? shipping.getPostalCode(): null,
                      shipping != null ? shipping.getCountryCode() : null);

        subsection("Items");
        List<OrderItem> items = order.getItems() != null ? order.getItems() : Collections.emptyList();
        for (OrderItem item : items) {
            if (Boolean.TRUE.equals(item.getKitComponent())) continue; // skip kit components - sub-rows of a parent kit
            int qty     = item.getQuantity() != null ? item.getQuantity().intValue() : 0;
            double cost = toDouble(moneyValue(item.getCost())); // OrderItem.cost is a Currency
            System.out.printf("  %-12s %-32s qty %d @ %s = %s%n",
                shorten(safeStr(item.getMerchantItemId()), 12),
                shorten(safeStr(item.getDescription()), 32),
                qty,
                money(cost, order.getCurrencyCode()),
                money(qty * cost, order.getCurrencyCode())
            );
        }

        if (order.getSummary() != null) {
            System.out.println();
            kv("Subtotal", money(toDouble(moneyValue(order.getSummary().getSubtotal())), order.getCurrencyCode()));
            if (moneyValue(order.getSummary().getTax()) != null)              kv("Tax",      money(toDouble(moneyValue(order.getSummary().getTax())), order.getCurrencyCode()));
            if (moneyValue(order.getSummary().getShippingHandlingTotal()) != null) kv("Shipping", money(toDouble(moneyValue(order.getSummary().getShippingHandlingTotal())), order.getCurrencyCode()));
            kv("Total",    money(toDouble(moneyValue(order.getSummary().getTotal())), order.getCurrencyCode()));
        }

        subsection("Payment");
        OrderPayment payment = order.getPayment();
        if (payment != null) {
            kv("Method", payment.getPaymentMethod());
            OrderPaymentCreditCard cc = payment.getCreditCard();
            if (cc != null) kv("Card", (safeStr(cc.getCardType()) + " ending " + (cc.getCardNumberTruncated() != null ? cc.getCardNumberTruncated() : "????")).trim());
            List<OrderPaymentTransaction> transactions = payment.getTransactions() != null ? payment.getTransactions() : Collections.emptyList();
            if (!transactions.isEmpty()) {
                subsection("Transactions");
                for (OrderPaymentTransaction tx : transactions) {
                    String status = Boolean.TRUE.equals(tx.getSuccessful()) ? "approved" : "failed";
                    System.out.printf("  %-21s %-30s %s%n",
                        safeStr(tx.getTransactionTimestamp()),
                        shorten(safeStr(tx.getTransactionGateway()), 30),
                        status
                    );
                }
            }
        }

        subsection("Marketing / Attribution");
        List<OrderUtm> utms = order.getUtms() != null ? order.getUtms() : Collections.emptyList();
        // Affiliate attribution lives on OrderAffiliate (expansion=affiliate); not pulled
        // here to keep the chargeback request light.
        if (utms.isEmpty()) {
            System.out.println("  No UTM clicks captured.");
        } else {
            OrderUtm mostRecent = utms.get(0); // index 0 is most recent click
            kv("Most recent UTM source",   mostRecent.getUtmSource());
            kv("Most recent UTM medium",   mostRecent.getUtmMedium());
            kv("Most recent UTM campaign", mostRecent.getUtmCampaign());
            kv("UTM clicks captured",      String.valueOf(utms.size()));
        }
    }

    private void renderSubscription(AutoOrder autoOrder, List<Order> rebillOrders, String currentOrderId, List<AutoOrderEmail> autoOrderEmails) {
        section("2. SUBSCRIPTION DETAILS");
        if (autoOrder == null) {
            System.out.println("  This order is NOT part of an auto order subscription.");
            return;
        }

        System.out.println("  This order IS part of an auto order subscription.");
        System.out.println();
        kv("Auto Order Code", autoOrder.getAutoOrderCode());
        kv("Status",          autoOrder.getStatus());
        kv("Enabled",         Boolean.TRUE.equals(autoOrder.getEnabled()) ? "yes" : "no");
        kv("Original Order",  autoOrder.getOriginalOrderId());
        kv("Next Attempt",    autoOrder.getNextAttempt() != null ? autoOrder.getNextAttempt() : "(none scheduled)");
        if (autoOrder.getCanceledDts() != null) {
            kv("Canceled",      autoOrder.getCanceledDts());
            kv("Canceled By",   safeStr(autoOrder.getCanceledByUser()));
            kv("Cancel Reason", safeStr(autoOrder.getCancelReason()));
        }
        kv("Total Rebills", String.valueOf(rebillOrders.size()));

        List<AutoOrderItem> aoItems = autoOrder.getItems() != null ? autoOrder.getItems() : Collections.emptyList();
        if (!aoItems.isEmpty()) {
            subsection("Items in Subscription");
            for (AutoOrderItem aoi : aoItems) {
                System.out.printf("  %-12s %-32s frequency: %s%n",
                    shorten(safeStr(aoi.getOriginalItemId()), 12),
                    shorten(safeStr(aoi.getOriginalItemId()), 32),
                    safeStr(aoi.getFrequency())
                );
            }
        }

        if (!rebillOrders.isEmpty()) {
            subsection("Rebill Timeline");
            List<Order> sorted = new ArrayList<>(rebillOrders);
            sorted.sort(Comparator.comparing(o -> safeStr(o.getCreationDts())));
            for (Order ro : sorted) {
                String roId    = safeStr(ro.getOrderId());
                String marker  = roId.equalsIgnoreCase(currentOrderId) ? "  *** THIS ORDER" : "";
                String roTotal = ro.getSummary() != null ? money(toDouble(moneyValue(ro.getSummary().getTotal())), ro.getCurrencyCode() != null ? ro.getCurrencyCode() : "USD") : "";
                System.out.printf("  %-22s %-22s %-10s %s%s%n",
                    safeStr(ro.getCreationDts()),
                    roId,
                    roTotal,
                    safeStr(ro.getCurrentStage()),
                    marker
                );
            }
        }

        if (!autoOrderEmails.isEmpty()) {
            subsection("Subscription-Level Emails (" + autoOrderEmails.size() + ")");
            int i = 1;
            for (AutoOrderEmail email : autoOrderEmails) {
                renderAutoOrderEmailDetail(i++, email);
            }
        } else {
            subsection("Subscription-Level Emails");
            System.out.println("  No subscription-level emails on record.");
        }
    }

    private void renderEmails(List<OrderEmail> emails) {
        section("3. EMAIL DELIVERY (" + emails.size() + " messages)");
        if (emails.isEmpty()) {
            System.out.println("  No email delivery records on file for this order.");
            return;
        }
        int i = 1;
        for (OrderEmail email : emails) {
            renderOrderEmailDetail(i++, email);
        }
    }

    private void renderOrderEmailDetail(int i, OrderEmail email) {
        renderEmailDetailFields(i,
            email.getSendDts(), email.getEmail(), email.getSubject(), email.isInternal(),
            email.isDelivered(), email.isSkipped(), email.getBounceDts(),
            email.isOpened(), email.getOpenedDts(), email.isClicked(), email.getClickedDts(),
            email.getDeliveryDts(), email.getReportingMta(), email.getSmtpResponse(),
            email.getBounceType(), email.getBounceSubType(), email.getBounceDiagnosticCode(),
            email.getSkipReason()
        );
    }

    private void renderAutoOrderEmailDetail(int i, AutoOrderEmail email) {
        renderEmailDetailFields(i,
            email.getSendDts(), email.getEmail(), email.getSubject(), email.isInternal(),
            email.isDelivered(), email.isSkipped(), email.getBounceDts(),
            email.isOpened(), email.getOpenedDts(), email.isClicked(), email.getClickedDts(),
            email.getDeliveryDts(), email.getReportingMta(), email.getSmtpResponse(),
            email.getBounceType(), email.getBounceSubType(), email.getBounceDiagnosticCode(),
            email.getSkipReason()
        );
    }

    private void renderEmailDetailFields(int i,
            String sendDts, String emailAddr, String subject, Boolean internal,
            Boolean delivered, Boolean skipped, String bounceDts,
            Boolean opened, String openedDts, Boolean clicked, String clickedDts,
            String deliveryDts, String reportingMta, String smtpResponse,
            String bounceType, String bounceSubType, String bounceDiagnostic,
            String skipReason) {
        String internalNote = Boolean.TRUE.equals(internal) ? "   (internal copy)" : "";
        System.out.printf("  [%d] sent %s%s%n", i, sendDts != null ? sendDts : "?", internalNote);
        System.out.printf("      To:               %s%n", safeStr(emailAddr));
        System.out.printf("      Subject:          %s%n", safeStr(subject));

        List<String> states = new ArrayList<>();
        if (Boolean.TRUE.equals(delivered)) states.add("DELIVERED");
        if (Boolean.TRUE.equals(skipped))   states.add("SKIPPED");
        if (bounceDts != null)              states.add("BOUNCED " + bounceDts);
        if (Boolean.TRUE.equals(opened))    states.add("OPENED " + safeStr(openedDts));
        if (Boolean.TRUE.equals(clicked))   states.add("CLICKED " + safeStr(clickedDts));
        System.out.printf("      Status:           %s%n", states.isEmpty() ? "unknown" : String.join(", ", states));

        if (deliveryDts != null)        System.out.printf("      Delivered:        %s%n", deliveryDts);
        if (reportingMta != null)       System.out.printf("      Reporting MTA:    %s%n", reportingMta);
        if (smtpResponse != null)       System.out.printf("      SMTP response:    %s%n", smtpResponse);
        if (bounceType != null)         System.out.printf("      Bounce type:      %s / %s%n", bounceType, safeStr(bounceSubType));
        if (bounceDiagnostic != null)   System.out.printf("      Diagnostic:       %s%n", bounceDiagnostic);
        if (skipReason != null)         System.out.printf("      Skip reason:      %s%n", skipReason);
        System.out.println();
    }

    private void renderPageViewHistory(List<OrderPageView> pageViews, String sessionReferrer, String sourceOrderId, boolean isRedirected) {
        section("4. PAGE VIEW HISTORY (" + pageViews.size() + " views)");
        if (isRedirected) {
            System.out.println("  Note: this is a subscription rebill. The disputed order itself has no");
            System.out.println("  checkout session of its own. The page views below are from the ORIGINAL");
            System.out.println("  order that started the subscription, where the customer's intent was");
            System.out.println("  captured during signup.");
            System.out.println();
            kv("Source order", sourceOrderId);
        }
        kv("Session referrer", sessionReferrer != null ? sessionReferrer : "(direct or unknown)");

        if (pageViews.isEmpty()) {
            System.out.println();
            System.out.println("  No page views captured" + (isRedirected ? " for the original order." : " for this order's session."));
            return;
        }

        subsection("Timeline");
        for (OrderPageView pv : pageViews) {
            String tops = pv.getTimeOnPage() == null ? "   -" : String.format("%4ds", pv.getTimeOnPage());
            System.out.printf("  %-22s %s   %s%n", safeStr(pv.getViewDts()), tops, safeStr(pv.getUrl()));
        }

        if (pageViews.size() >= 2) {
            try {
                OffsetDateTime first = OffsetDateTime.parse(pageViews.get(0).getViewDts());
                OffsetDateTime last  = OffsetDateTime.parse(pageViews.get(pageViews.size() - 1).getViewDts());
                long elapsed = last.toEpochSecond() - first.toEpochSecond();
                if (elapsed > 0) {
                    long mins = elapsed / 60;
                    long secs = elapsed % 60;
                    System.out.println();
                    kv("Session length", mins + "m " + secs + "s (first view to last view)");
                }
            } catch (DateTimeParseException | NullPointerException ignored) {
                // unparseable timestamp; skip the elapsed calc
            }
        }

        Set<String> uniqueUrls = new LinkedHashSet<>();
        for (OrderPageView pv : pageViews) {
            if (pv.getUrl() != null) uniqueUrls.add(pv.getUrl());
        }
        kv("Unique URLs visited", String.valueOf(uniqueUrls.size()));
    }

    private void renderAddress(String firstName, String lastName, String company,
                                String addr1, String addr2, String city, String state,
                                String postalCode, String countryCode) {
        if (firstName == null && lastName == null && addr1 == null && city == null) {
            System.out.println("  (none on file)");
            return;
        }
        String name    = joinNonEmpty(" ", firstName, lastName);
        String cityRow = ((city != null ? city : "")
                          + (state != null ? ", " + state : "")
                          + " " + (postalCode != null ? postalCode : "")).trim();
        for (String line : new String[] { name, company, addr1, addr2, cityRow, countryCode }) {
            if (line != null && !line.trim().isEmpty()) System.out.println("  " + line);
        }
    }

    private void renderFooter() {
        System.out.println();
        hr('=');
        System.out.println("  END OF EVIDENCE REPORT");
        hr('=');
    }

    // =====================================================================
    // Tiny formatting primitives
    // =====================================================================

    private void hr(char c) {
        char[] chars = new char[80];
        Arrays.fill(chars, c);
        System.out.println(new String(chars));
    }

    private void section(String title) {
        System.out.println();
        hr('=');
        System.out.println("  " + title);
        hr('=');
        System.out.println();
    }

    private void subsection(String title) {
        System.out.println();
        System.out.println("  " + title);
        char[] dashes = new char[title.length()];
        Arrays.fill(dashes, '-');
        System.out.println("  " + new String(dashes));
    }

    private void kv(String label, Object value) {
        System.out.printf("  %-22s %s%n", label + ":", value != null ? value.toString() : "");
    }

    private static String safeStr(String s) { return s != null ? s : ""; }

    private static String shorten(String s, int n) {
        if (s == null) return "";
        return s.length() <= n ? s : s.substring(0, n - 1) + "~";
    }

    private static String joinNonEmpty(String sep, String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p != null && !p.isEmpty()) {
                if (sb.length() > 0) sb.append(sep);
                sb.append(p);
            }
        }
        return sb.toString();
    }

    // SDK money fields are Currency objects, not raw numbers. Pull the localized
    // value off; null-safe for missing/optional fields.
    private static Double moneyValue(Currency c) {
        if (c == null || c.getLocalized() == null) return null;
        return c.getLocalized().doubleValue();
    }

    private static double toDouble(Double d) {
        return d != null ? d : 0.0;
    }

    private static String money(double amount, String currency) {
        String sign = amount < 0 ? "-" : "";
        return String.format("%s$%,.2f %s", sign, Math.abs(amount), currency != null ? currency : "").trim();
    }

    private static void failOp(String operation, Error error) {
        System.err.println("ERROR in " + operation + ":");
        System.err.println("  Developer message: " + (error.getDeveloperMessage() != null ? error.getDeveloperMessage() : ""));
        System.err.println("  User message:      " + (error.getUserMessage()      != null ? error.getUserMessage()      : ""));
        System.exit(1);
    }
}
