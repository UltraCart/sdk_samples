### Expansion

By default, when you read an order, a limited object is returned.  If you specify the `_expand` 
parameter, additional properties of the order object are returned.  We encourage you to limit the 
amount of information that you query for orders, to the minimal amount possible to have optimal 
communication.  The following expansion operations are available.

* affiliate
* affiliate.ledger
* auto_order
* billing
* buysafe
* channel_partner
* checkout
* coupon
* customer_profile
* digital_order
* edi
* fraud_score
* gift
* gift_certificate
* internal
* item
* linked_shipment
* marketing
* payment
* payment.transaction
* point_of_sale
* quote
* salesforce
* shipping
* shipping.tracking_number_details
* summary
* taxes
