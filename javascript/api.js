import {
    ApiClient,
    AutoOrderApi,
    ChannelPartnerApi,
    CheckoutApi,
    CouponApi,
    CustomerApi,
    FulfillmentApi, GiftCertificateApi, ItemApi, OauthApi, OrderApi, WebhookApi
} from 'ultra_cart_rest_api_v2';

// sample key yo. only works in dev, so get your own.
// See this article: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
let apiKey = 'a1f1b4b50a5c290195256170e70001006b7722bc8075e30195256170e7000100';
const apiClient = new ApiClient();
apiClient.defaultHeaders['X-UltraCart-Api-Version'] = '2017-03-01';
apiClient.authentications.ultraCartSimpleApiKey.apiKey = apiKey;
// console.log('apiClient', apiClient);

export const autoOrderApi = new AutoOrderApi(apiClient);
export const channelPartnerApi = new ChannelPartnerApi(apiClient);
export const checkoutApi = new CheckoutApi(apiClient);
export const couponApi = new CouponApi(apiClient);
export const customerApi = new CustomerApi(apiClient);
export const fulfillmentApi = new FulfillmentApi(apiClient);
export const giftCertificateApi = new GiftCertificateApi(apiClient);
export const itemApi = new ItemApi(apiClient);
export const orderApi = new OrderApi(apiClient);
export const oauthApi = new OauthApi(apiClient);
export const webhookApi = new WebhookApi(apiClient);
