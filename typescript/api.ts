import {
    BulkApi,
    AffiliateApi,
    CouponApi,
    GiftCertificateApi,
    OrderApi,
    Configuration,
    OauthApi,
    WebhookApi,
    CustomerApi,
    FraudApi,
    ItemApi,
    FulfillmentApi,
    AutoOrderApi,
    CheckoutApi,
    ChannelPartnerApi
} from 'ultracart_rest_api_v2_typescript';

let apiKey = '55f7c4940f843d01a10c5d77f17001009dcc02345e79bd01a10c5d77f1700100';

// export const couponApi = new CouponApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));
// export const giftCertificateApi = new GiftCertificateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));
// export const orderApi = new OrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));

export const affiliateApi = new AffiliateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const autoOrderApi = new AutoOrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const bulkApi = new BulkApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const channelPartnerApi = new ChannelPartnerApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const checkoutApi = new CheckoutApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const couponApi = new CouponApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const customerApi = new CustomerApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const fraudApi = new FraudApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const fulfillmentApi = new FulfillmentApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const giftCertificateApi = new GiftCertificateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const itemApi = new ItemApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const orderApi = new OrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const oauthApi = new OauthApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const webhookApi = new WebhookApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));



// TODO add the other apis as the samples are created.