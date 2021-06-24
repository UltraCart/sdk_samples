### Expansion

The customer REST API has the capability to expand everything related to the customer including 
the original and rebill order records.  By default, when you read an customer, a
limited object is returned.  If you specify the `_expand` parameter, additional properties of the customer
object are returned.  We encourage you to limit the amount of information that you query for customers
to the minimal amount possible to have optimal communication.  The following expansion operations are
available.

* attachments
* billing
* cards
* cc_emails
* loyalty
* orders_summary
* pricing_tiers
* privacy
* quotes_summary
* reviewer
* shipping
* software_entitlements
* tags
* tax_codes
