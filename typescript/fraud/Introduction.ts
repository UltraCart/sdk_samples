/**
 * The Fraud API (alpha) lets you manage UltraCart's fraud rule engine programmatically.
 * Fraud rules inspect incoming orders and take an action (flag for review, decline, exempt,
 * etc.) when their conditions match. The API also exposes the lookup values you need to build
 * rules and a quick way to decline a known-bad email address.
 *
 * The samples in this directory:
 *   GetFraudLookupValues.ts - retrieve the lookup values (countries, affiliates, rule types,
 *                             ip range types, rule groups) used when building rules.
 *   SearchFraudRules.ts      - search existing fraud rules by criteria.
 *   InsertFraudRule.ts       - create several fraud rules of different types.
 *   DeleteFraudRule.ts       - delete a fraud rule by its oid (self-contained: inserts one first).
 *   DeclineEmail.ts          - decline a specific email address.
 *
 * This key has fraud_read and fraud_write rights.  Create a Simple Key:
 * https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
 */
export {};
