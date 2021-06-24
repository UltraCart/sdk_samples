### Expansion

The item REST API has one of the largest expansion capabilities.  By default, when you read an item, a
limited object is returned.  If you specify the `_expand` parameter, additional properties of the item
object are returned.  We encourage you to limit the amount of information that you query for items,
to the minimal amount possible to have optimal communication.  The following expansion operations are
available.

* accounting
* amember
* auto_order 
* auto_order.steps
* ccbill
* channel_partner_mappings
* chargeback
* checkout
* content
* content.assignments 
* content.attributes
* content.multimedia 
* content.multimedia.thumbnails
* digital_delivery
* ebay
* email_notifications
* enrollment123
* gift_certificate
* google_product_search
* kit_definition
* identifiers
* instant_payment_notifications
* internal
* options
* payment_processing
* physical
* pricing 
* pricing.tiers
* realtime_pricing
* related
* reporting
* restriction
* revguard
* reviews
* salesforce
* shipping
* shipping.cases
* shipping.destination_markups 
* shipping.destination_restrictions
* shipping.distribution_centers
* shipping.methods
* shipping.package_requirements
* tax
* third_party_email_marketing
* variations
* wishlist_member