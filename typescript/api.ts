import {
    CouponApi,
    GiftCertificateApi,
    OrderApi,
    Configuration,
    OauthApi,
    WebhookApi,
    CustomerApi,
    ItemApi,
    FulfillmentApi,
    AutoOrderApi,
    CheckoutApi,
    ChannelPartnerApi
} from 'ultracart_rest_api_v2_typescript';

let apiKey = 'a1f1b4b50a5c290195256170e70001006b7722bc8075e30195256170e7000100';

// export const couponApi = new CouponApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));
// export const giftCertificateApi = new GiftCertificateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));
// export const orderApi = new OrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey, fetchApi: fetch }));

export const autoOrderApi = new AutoOrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const channelPartnerApi = new ChannelPartnerApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const checkoutApi = new CheckoutApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const couponApi = new CouponApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const customerApi = new CustomerApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const fulfillmentApi = new FulfillmentApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const giftCertificateApi = new GiftCertificateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const itemApi = new ItemApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const orderApi = new OrderApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const oauthApi = new OauthApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const webhookApi = new WebhookApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));



// TODO add the other apis as the samples are created.