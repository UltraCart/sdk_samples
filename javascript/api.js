import {
    ApiClient,
    AutoOrderApi,
    BulkApi,
    ChannelPartnerApi,
    CheckoutApi,
    CouponApi,
    CustomerApi,
    FraudApi,
    FulfillmentApi, GiftCertificateApi, ItemApi, OauthApi, OrderApi, WebhookApi
} from 'ultra_cart_rest_api_v2';

// sample key yo. only works in dev, so get your own.
// See this article: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
let apiKey = 'fbfa455fa3bc2e019e456ffe06200100122d966fc28870019e456ffe08200100';
const apiClient = new ApiClient();
apiClient.defaultHeaders['X-UltraCart-Api-Version'] = '2017-03-01';
apiClient.authentications.ultraCartSimpleApiKey.apiKey = apiKey;
// console.log('apiClient', apiClient);

export const autoOrderApi = new AutoOrderApi(apiClient);
export const bulkApi = new BulkApi(apiClient);
export const channelPartnerApi = new ChannelPartnerApi(apiClient);
export const checkoutApi = new CheckoutApi(apiClient);
export const couponApi = new CouponApi(apiClient);
export const customerApi = new CustomerApi(apiClient);
export const fraudApi = new FraudApi(apiClient);
export const fulfillmentApi = new FulfillmentApi(apiClient);
export const giftCertificateApi = new GiftCertificateApi(apiClient);
export const itemApi = new ItemApi(apiClient);
export const orderApi = new OrderApi(apiClient);
export const oauthApi = new OauthApi(apiClient);
export const webhookApi = new WebhookApi(apiClient);
