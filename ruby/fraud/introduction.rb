# frozen_string_literal: true

# The Fraud API (alpha) lets you manage UltraCart's fraud rule engine programmatically.
# Fraud rules inspect incoming orders and take an action (flag for review, decline, exempt,
# etc.) when their conditions match. The API also exposes the lookup values you need to build
# rules and a quick way to decline a known-bad email address.
#
# The samples in this directory:
#   get_fraud_lookup_values.rb - retrieve the lookup values (countries, affiliates, rule types,
#                                ip range types, rule groups) used when building rules.
#   search_fraud_rules.rb      - search existing fraud rules by criteria.
#   insert_fraud_rule.rb       - create several fraud rules of different types.
#   delete_fraud_rule.rb       - delete a fraud rule by its oid (self-contained: inserts one first).
#   decline_email.rb           - decline a specific email address.
#
# This key has fraud_read and fraud_write rights.  Create a Simple Key:
# https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
