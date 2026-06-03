using System;
using System.Reflection;

namespace SdkSample.fraud
{
    /// <summary>
    /// The Fraud API (alpha) lets you manage UltraCart's fraud rule engine programmatically.
    /// Fraud rules inspect incoming orders and take an action (flag for review, decline, exempt,
    /// etc.) when their conditions match. The API also exposes the lookup values you need to build
    /// rules and a quick way to decline a known-bad email address.
    ///
    /// The samples in this directory:
    ///   GetFraudLookupValues.cs - retrieve the lookup values (countries, affiliates, rule types,
    ///                             ip range types, rule groups) used when building rules.
    ///   SearchFraudRules.cs      - search existing fraud rules by criteria.
    ///   InsertFraudRule.cs       - create several fraud rules of different types.
    ///   DeleteFraudRule.cs       - delete a fraud rule by its oid (self-contained: inserts one first).
    ///   DeclineEmail.cs          - decline a specific email address.
    ///
    /// This key has fraud_read and fraud_write rights.  Create a Simple Key:
    /// https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
    /// </summary>
    public class Introduction
    {
        public static void Execute()
        {
            Console.WriteLine("--- " + MethodBase.GetCurrentMethod()?.DeclaringType?.Name + " ---");
            Console.WriteLine("See the other samples in this directory for fraud API usage.");
        }
    }
}
