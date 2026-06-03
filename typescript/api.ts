import {
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

let apiKey = 'fbfa455fa3bc2e019e456ffe06200100122d966fc28870019e456ffe08200100';

// export const couponApi = new CouponApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));
// export const giftCertificateApi = new GiftCertificateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));
// export const orderApi = new OrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));

export const autoOrderApi = new AutoOrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
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