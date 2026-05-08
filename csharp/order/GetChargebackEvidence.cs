using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace SdkSample.order
{
    /// <summary>
    /// GetChargebackEvidence
    ///
    /// Pulls everything from UltraCart that is useful when fighting a chargeback
    /// dispute and prints a formatted evidence report. Designed as a starting
    /// point for building the actual evidence packet you submit to the card
    /// processor.
    ///
    /// What this sample demonstrates:
    ///   1. Order detail with the SPECIFIC expansions a chargeback case relies
    ///      on. Notice we list every expansion explicitly - no shortcuts.
    ///      Listing them individually keeps your payload small and forces you
    ///      to think about what evidence each one represents.
    ///   2. Email delivery records via the dedicated /emails endpoint (not via
    ///      expansion). Use the dedicated endpoint for chargeback work - it is
    ///      the canonical full-fidelity source for SES delivery events on every
    ///      order.
    ///   3. Page view history (the customer was on your site, navigated through
    ///      pages, spent time before placing the order).
    ///   4. Auto-order detection: a large fraction of chargebacks are
    ///      subscription disputes. When the order is part of an auto order,
    ///      the sample pulls the parent subscription, every rebill, and the
    ///      auto-order-level email log. For rebills specifically, the page-view
    ///      lookup pivots to the ORIGINAL order (the rebill itself has no
    ///      checkout session).
    ///
    /// Requires the May 2026 SDK build with GetOrderEmails,
    /// GetOrderPageViewHistory, and GetAutoOrderEmails.
    /// </summary>
    public class GetChargebackEvidence
    {
        private static readonly string OrderExpansion = string.Join(",", new[]
        {
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
        });

        private static readonly string AutoOrderExpansion = string.Join(",", new[]
        {
            "items",                    // subscription line items + frequency
            "rebill_orders",            // every rebill that has occurred
            "logs",                     // status changes, payment attempts, cancellations
            "management"                // self-service management state
        });

        public static void Execute()
        {
            Execute("DEMO-0009104976");
        }

        public static void Execute(string orderId)
        {
            OrderApi orderApi = new OrderApi(Constants.ApiKey);
            AutoOrderApi autoOrderApi = new AutoOrderApi(Constants.ApiKey);

            // Order detail
            OrderResponse orderResponse = orderApi.GetOrder(orderId, OrderExpansion);
            if (orderResponse.Error != null) FailOp("GetOrder", orderResponse.Error);
            Order order = orderResponse.Order;

            // Use the dedicated /emails endpoint rather than _expand=emails. The
            // dedicated endpoint is the canonical full-fidelity source for SES
            // delivery events.
            OrderEmailsResponse emailsResponse = orderApi.GetOrderEmails(orderId);
            if (emailsResponse.Error != null) FailOp("GetOrderEmails", emailsResponse.Error);
            List<OrderEmail> emails = emailsResponse.Emails ?? new List<OrderEmail>();

            // Auto-order chain BEFORE page views: a rebill's own page view
            // history is empty - the meaningful history lives on the original order.
            AutoOrder autoOrder = null;
            List<AutoOrderEmail> autoOrderEmails = new List<AutoOrderEmail>();
            List<Order> rebillOrders = new List<Order>();
            OrderAutoOrder autoOrderPointer = order.AutoOrder;
            if (autoOrderPointer != null && autoOrderPointer.AutoOrderOid.HasValue)
            {
                int autoOrderOid = autoOrderPointer.AutoOrderOid.Value;

                AutoOrderResponse aoResponse = autoOrderApi.GetAutoOrder(autoOrderOid, AutoOrderExpansion);
                if (aoResponse.Error != null) FailOp("GetAutoOrder", aoResponse.Error);
                autoOrder = aoResponse.AutoOrder;
                rebillOrders = autoOrder.RebillOrders ?? new List<Order>();

                AutoOrderEmailsResponse aoEmailsResponse = autoOrderApi.GetAutoOrderEmails(autoOrderOid);
                if (aoEmailsResponse.Error != null) FailOp("GetAutoOrderEmails", aoEmailsResponse.Error);
                autoOrderEmails = aoEmailsResponse.Emails ?? new List<AutoOrderEmail>();
            }

            // For a rebill chargeback, page views live on the ORIGINAL order.
            string pageViewOrderId = orderId;
            bool pageViewIsRedirected = false;
            if (autoOrder != null
                && !string.IsNullOrEmpty(autoOrder.OriginalOrderId)
                && !autoOrder.OriginalOrderId.Equals(orderId, StringComparison.OrdinalIgnoreCase))
            {
                pageViewOrderId = autoOrder.OriginalOrderId;
                pageViewIsRedirected = true;
            }

            OrderPageViewHistoryResponse pageViewResponse = orderApi.GetOrderPageViewHistory(pageViewOrderId);
            if (pageViewResponse.Error != null) FailOp("GetOrderPageViewHistory", pageViewResponse.Error);
            List<OrderPageView> pageViews = pageViewResponse.PageViews ?? new List<OrderPageView>();
            string sessionReferrer = pageViewResponse.Referrer;

            RenderHeader(orderId);
            RenderOrderOverview(order);
            RenderSubscription(autoOrder, rebillOrders, orderId, autoOrderEmails);
            RenderEmails(emails);
            RenderPageViewHistory(pageViews, sessionReferrer, pageViewOrderId, pageViewIsRedirected);
            RenderFooter();
        }

        // =====================================================================
        // Render helpers
        // =====================================================================

        private static void RenderHeader(string orderId)
        {
            Hr('=');
            Console.WriteLine("  CHARGEBACK EVIDENCE REPORT");
            Console.WriteLine("  UltraCart REST API v2");
            Hr('=');
            Console.WriteLine();
            Kv("Order ID",  orderId);
            Kv("Generated", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"));
        }

        private static void RenderOrderOverview(Order order)
        {
            Section("1. ORDER OVERVIEW");

            Kv("Placed",   order.CreationDts);
            Kv("Stage",    order.CurrentStage);
            Kv("Currency", order.CurrencyCode);
            if (order.Summary != null) Kv("Order Total", Money(ToDouble(order.Summary.Total), order.CurrencyCode));

            Subsection("Customer");
            OrderBilling billing = order.Billing;
            if (billing != null)
            {
                Kv("Name",  JoinNonEmpty(" ", billing.FirstName, billing.LastName));
                Kv("Email", billing.Email);
                Kv("Phone", billing.Phone);
            }
            Customer cp = order.CustomerProfile;
            Kv("Customer Profile", cp != null ? $"yes (oid {cp.CustomerProfileOid?.ToString() ?? "?"})" : "no (guest checkout)");
            OrderMarketing marketing = order.Marketing;
            if (marketing != null && !string.IsNullOrEmpty(marketing.OriginalSourceCode))
                Kv("Original Source", marketing.OriginalSourceCode);

            Subsection("Billing Address");
            RenderAddress(billing?.FirstName, billing?.LastName, billing?.Company,
                          billing?.Address1, billing?.Address2, billing?.City,
                          billing?.State, billing?.PostalCode, billing?.CountryCode);

            OrderShipping shipping = order.Shipping;
            Subsection("Shipping Address");
            RenderAddress(shipping?.FirstName, shipping?.LastName, shipping?.Company,
                          shipping?.Address1, shipping?.Address2, shipping?.City,
                          shipping?.State, shipping?.PostalCode, shipping?.CountryCode);

            Subsection("Items");
            foreach (OrderItem item in order.Items ?? new List<OrderItem>())
            {
                if (item.KitComponent == true) continue; // skip kit components
                int qty = item.Quantity.HasValue ? (int)item.Quantity.Value : 0;
                double cost = ToDouble(item.Cost);
                Console.WriteLine(
                    $"  {Pad(Shorten(item.MerchantItemId ?? "", 12), 12)} {Pad(Shorten(item.Description ?? "", 32), 32)} qty {qty} @ {Money(cost, order.CurrencyCode)} = {Money(qty * cost, order.CurrencyCode)}"
                );
            }

            if (order.Summary != null)
            {
                Console.WriteLine();
                Kv("Subtotal", Money(ToDouble(order.Summary.Subtotal), order.CurrencyCode));
                if (order.Summary.Tax              != null) Kv("Tax",      Money(ToDouble(order.Summary.Tax), order.CurrencyCode));
                if (order.Summary.ShippingHandling != null) Kv("Shipping", Money(ToDouble(order.Summary.ShippingHandling), order.CurrencyCode));
                Kv("Total",    Money(ToDouble(order.Summary.Total), order.CurrencyCode));
            }

            Subsection("Payment");
            OrderPayment payment = order.Payment;
            if (payment != null)
            {
                Kv("Method", payment.PaymentMethod);
                OrderPaymentCreditCard cc = payment.CreditCard;
                if (cc != null) Kv("Card", $"{cc.CardType ?? ""} ending {cc.CardNumberTruncated ?? "????"}".Trim());
                List<OrderPaymentTransaction> transactions = payment.Transactions ?? new List<OrderPaymentTransaction>();
                if (transactions.Count > 0)
                {
                    Subsection("Transactions");
                    foreach (OrderPaymentTransaction tx in transactions)
                    {
                        string status = tx.Successful == true ? "approved" : "failed";
                        Console.WriteLine(
                            $"  {Pad(tx.Dts ?? "", 21)} {Pad(tx.TransactionType ?? "", 12)} {Pad(Money(ToDouble(tx.Amount), order.CurrencyCode), 12)} {status}"
                        );
                    }
                }
            }

            Subsection("Marketing / Attribution");
            List<OrderUtm> utms = order.Utms ?? new List<OrderUtm>();
            if (marketing != null) Kv("Affiliate ID", marketing.AffiliateId?.ToString() ?? "(none)");
            if (utms.Count == 0)
            {
                Console.WriteLine("  No UTM clicks captured.");
            }
            else
            {
                OrderUtm mostRecent = utms[0]; // index 0 is most recent click
                Kv("Most recent UTM source",   mostRecent.UtmSource);
                Kv("Most recent UTM medium",   mostRecent.UtmMedium);
                Kv("Most recent UTM campaign", mostRecent.UtmCampaign);
                Kv("UTM clicks captured",      utms.Count.ToString());
            }
        }

        private static void RenderSubscription(AutoOrder autoOrder, List<Order> rebillOrders, string currentOrderId, List<AutoOrderEmail> autoOrderEmails)
        {
            Section("2. SUBSCRIPTION DETAILS");

            if (autoOrder == null)
            {
                Console.WriteLine("  This order is NOT part of an auto order subscription.");
                return;
            }

            Console.WriteLine("  This order IS part of an auto order subscription.");
            Console.WriteLine();
            Kv("Auto Order Code", autoOrder.AutoOrderCode);
            Kv("Status",          autoOrder.Status);
            Kv("Enabled",         autoOrder.Enabled == true ? "yes" : "no");
            Kv("Original Order",  autoOrder.OriginalOrderId);
            Kv("Next Attempt",    autoOrder.NextAttempt ?? "(none scheduled)");
            if (autoOrder.CanceledDts != null)
            {
                Kv("Canceled",      autoOrder.CanceledDts);
                Kv("Canceled By",   autoOrder.CanceledByUser ?? "");
                Kv("Cancel Reason", autoOrder.CancelReason   ?? "");
            }
            Kv("Total Rebills", rebillOrders.Count.ToString());

            List<AutoOrderItem> aoItems = autoOrder.Items ?? new List<AutoOrderItem>();
            if (aoItems.Count > 0)
            {
                Subsection("Items in Subscription");
                foreach (AutoOrderItem aoi in aoItems)
                {
                    Console.WriteLine(
                        $"  {Pad(Shorten(aoi.OriginalItemId ?? "", 12), 12)} {Pad(Shorten(aoi.OriginalItemId ?? "", 32), 32)} frequency: {aoi.Frequency ?? ""}"
                    );
                }
            }

            if (rebillOrders.Count > 0)
            {
                Subsection("Rebill Timeline");
                List<Order> sorted = rebillOrders
                    .OrderBy(o => o.CreationDts ?? string.Empty, StringComparer.Ordinal)
                    .ToList();
                foreach (Order ro in sorted)
                {
                    string roId    = ro.OrderId ?? "";
                    string marker  = roId.Equals(currentOrderId, StringComparison.OrdinalIgnoreCase) ? "  *** THIS ORDER" : "";
                    string roTotal = ro.Summary != null ? Money(ToDouble(ro.Summary.Total), ro.CurrencyCode ?? "USD") : "";
                    Console.WriteLine(
                        $"  {Pad(ro.CreationDts ?? "", 22)} {Pad(roId, 22)} {Pad(roTotal, 10)} {ro.CurrentStage ?? ""}{marker}"
                    );
                }
            }

            if (autoOrderEmails.Count > 0)
            {
                Subsection($"Subscription-Level Emails ({autoOrderEmails.Count})");
                int i = 1;
                foreach (AutoOrderEmail email in autoOrderEmails)
                    RenderAutoOrderEmailDetail(i++, email);
            }
            else
            {
                Subsection("Subscription-Level Emails");
                Console.WriteLine("  No subscription-level emails on record.");
            }
        }

        private static void RenderEmails(List<OrderEmail> emails)
        {
            Section($"3. EMAIL DELIVERY ({emails.Count} messages)");
            if (emails.Count == 0)
            {
                Console.WriteLine("  No email delivery records on file for this order.");
                return;
            }
            int i = 1;
            foreach (OrderEmail email in emails)
                RenderOrderEmailDetail(i++, email);
        }

        private static void RenderOrderEmailDetail(int i, OrderEmail email)
        {
            RenderEmailDetailFields(i,
                email.SendDts, email.Email, email.Subject, email.Internal,
                email.Delivered, email.Skipped, email.BounceDts,
                email.Opened, email.OpenedDts, email.Clicked, email.ClickedDts,
                email.DeliveryDts, email.ReportingMta, email.SmtpResponse,
                email.BounceType, email.BounceSubType, email.BounceDiagnosticCode,
                email.SkipReason);
        }

        private static void RenderAutoOrderEmailDetail(int i, AutoOrderEmail email)
        {
            RenderEmailDetailFields(i,
                email.SendDts, email.Email, email.Subject, email.Internal,
                email.Delivered, email.Skipped, email.BounceDts,
                email.Opened, email.OpenedDts, email.Clicked, email.ClickedDts,
                email.DeliveryDts, email.ReportingMta, email.SmtpResponse,
                email.BounceType, email.BounceSubType, email.BounceDiagnosticCode,
                email.SkipReason);
        }

        private static void RenderEmailDetailFields(int i,
            string sendDts, string emailAddr, string subject, bool? internal_,
            bool? delivered, bool? skipped, string bounceDts,
            bool? opened, string openedDts, bool? clicked, string clickedDts,
            string deliveryDts, string reportingMta, string smtpResponse,
            string bounceType, string bounceSubType, string bounceDiagnostic,
            string skipReason)
        {
            string internalNote = internal_ == true ? "   (internal copy)" : "";
            Console.WriteLine($"  [{i}] sent {sendDts ?? "?"}{internalNote}");
            Console.WriteLine($"      To:               {emailAddr ?? ""}");
            Console.WriteLine($"      Subject:          {subject   ?? ""}");

            List<string> states = new List<string>();
            if (delivered == true)            states.Add("DELIVERED");
            if (skipped   == true)            states.Add("SKIPPED");
            if (bounceDts != null)            states.Add($"BOUNCED {bounceDts}");
            if (opened    == true)            states.Add($"OPENED {openedDts ?? ""}");
            if (clicked   == true)            states.Add($"CLICKED {clickedDts ?? ""}");
            Console.WriteLine($"      Status:           {(states.Count == 0 ? "unknown" : string.Join(", ", states))}");

            if (deliveryDts      != null) Console.WriteLine($"      Delivered:        {deliveryDts}");
            if (reportingMta     != null) Console.WriteLine($"      Reporting MTA:    {reportingMta}");
            if (smtpResponse     != null) Console.WriteLine($"      SMTP response:    {smtpResponse}");
            if (bounceType       != null) Console.WriteLine($"      Bounce type:      {bounceType} / {bounceSubType ?? ""}");
            if (bounceDiagnostic != null) Console.WriteLine($"      Diagnostic:       {bounceDiagnostic}");
            if (skipReason       != null) Console.WriteLine($"      Skip reason:      {skipReason}");
            Console.WriteLine();
        }

        private static void RenderPageViewHistory(List<OrderPageView> pageViews, string sessionReferrer, string sourceOrderId, bool isRedirected)
        {
            Section($"4. PAGE VIEW HISTORY ({pageViews.Count} views)");
            if (isRedirected)
            {
                Console.WriteLine("  Note: this is a subscription rebill. The disputed order itself has no");
                Console.WriteLine("  checkout session of its own. The page views below are from the ORIGINAL");
                Console.WriteLine("  order that started the subscription, where the customer's intent was");
                Console.WriteLine("  captured during signup.");
                Console.WriteLine();
                Kv("Source order", sourceOrderId);
            }
            Kv("Session referrer", sessionReferrer ?? "(direct or unknown)");

            if (pageViews.Count == 0)
            {
                Console.WriteLine();
                Console.WriteLine("  No page views captured" + (isRedirected ? " for the original order." : " for this order's session."));
                return;
            }

            Subsection("Timeline");
            foreach (OrderPageView pv in pageViews)
            {
                string tops = pv.TimeOnPage.HasValue ? $"{pv.TimeOnPage.Value,4}s" : "   -";
                Console.WriteLine($"  {Pad(pv.ViewDts ?? "", 22)} {tops}   {pv.Url ?? ""}");
            }

            if (pageViews.Count >= 2)
            {
                if (DateTime.TryParse(pageViews[0].ViewDts, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime first) &&
                    DateTime.TryParse(pageViews[pageViews.Count - 1].ViewDts, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime last) &&
                    last > first)
                {
                    int elapsed = (int)(last - first).TotalSeconds;
                    int mins = elapsed / 60;
                    int secs = elapsed % 60;
                    Console.WriteLine();
                    Kv("Session length", $"{mins}m {secs}s (first view to last view)");
                }
            }

            HashSet<string> uniqueUrls = new HashSet<string>(pageViews.Where(pv => !string.IsNullOrEmpty(pv.Url)).Select(pv => pv.Url));
            Kv("Unique URLs visited", uniqueUrls.Count.ToString());
        }

        private static void RenderAddress(string firstName, string lastName, string company,
                                           string addr1, string addr2, string city, string state,
                                           string postalCode, string countryCode)
        {
            if (string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName)
                && string.IsNullOrEmpty(addr1)  && string.IsNullOrEmpty(city))
            {
                Console.WriteLine("  (none on file)");
                return;
            }

            string name = JoinNonEmpty(" ", firstName, lastName);
            string cityRow = ((city ?? "") + (string.IsNullOrEmpty(state) ? "" : ", " + state) + " " + (postalCode ?? "")).Trim();
            foreach (string line in new[] { name, company, addr1, addr2, cityRow, countryCode })
            {
                if (!string.IsNullOrWhiteSpace(line)) Console.WriteLine("  " + line);
            }
        }

        private static void RenderFooter()
        {
            Console.WriteLine();
            Hr('=');
            Console.WriteLine("  END OF EVIDENCE REPORT");
            Hr('=');
        }

        // =====================================================================
        // Tiny formatting primitives
        // =====================================================================

        private static void Hr(char c) => Console.WriteLine(new string(c, 80));

        private static void Section(string title)
        {
            Console.WriteLine();
            Hr('=');
            Console.WriteLine("  " + title);
            Hr('=');
            Console.WriteLine();
        }

        private static void Subsection(string title)
        {
            Console.WriteLine();
            Console.WriteLine("  " + title);
            Console.WriteLine("  " + new string('-', title.Length));
        }

        private static void Kv(string label, object value)
        {
            string val = value == null ? "" : value.ToString();
            Console.WriteLine($"  {(label + ":").PadRight(22)} {val}");
        }

        private static string Pad(string s, int n)
        {
            s = s ?? "";
            return s.Length >= n ? s : s + new string(' ', n - s.Length);
        }

        private static string Shorten(string s, int n)
        {
            s = s ?? "";
            return s.Length <= n ? s : s.Substring(0, n - 1) + "~";
        }

        private static string JoinNonEmpty(string sep, params string[] parts)
        {
            return string.Join(sep, parts.Where(p => !string.IsNullOrEmpty(p)));
        }

        private static double ToDouble(decimal? d) => d.HasValue ? (double)d.Value : 0.0;

        private static string Money(double amount, string currency)
        {
            string sign = amount < 0 ? "-" : "";
            return $"{sign}${Math.Abs(amount):N2} {currency ?? ""}".Trim();
        }

        private static void FailOp(string operation, com.ultracart.admin.v2.Model.Error error)
        {
            Console.Error.WriteLine($"ERROR in {operation}:");
            Console.Error.WriteLine($"  Developer message: {error.DeveloperMessage ?? ""}");
            Console.Error.WriteLine($"  User message:      {error.UserMessage      ?? ""}");
            Environment.Exit(1);
        }
    }
}
