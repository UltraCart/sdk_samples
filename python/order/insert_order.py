"""
 * Please do not use OrderApi.insertOrder()
 * This method was provided in the first release of our REST API.
 * It was replaced with our ChannelPartnerApi.importChannelPartnerOrder()
 *
 * Here are your options:
 * If you need to add regular orders that still require payment processing, use the CheckoutApi.
 *    The CheckoutApi has fantastic support for payment processing.
 *
 * If you need to add channel partner orders (eBay, Amazon, your call center, etc), use the ChannelPartnerApi.
 *    The ChannelPartnerApi has appropriate support for processing such orders.
 *
 * We support our entire API forever, so this method remains active.  But, we do not provide any samples for it.
 * You may use it, but we believe it will require extra time and effort and possibly much frustration.
 *
 * Reminder: The ONLY way to provide credit card numbers and cvv numbers to the UltraCart system is through
 * hosted fields.
 * See: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
 * See: https://github.com/UltraCart/sdk_samples/blob/master/hosted_fields/hosted_fields.html
"""
