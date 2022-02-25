import { 
    CouponApi, 
    GiftCertificateApi,
    Configuration 
} from 'ultracart_rest_api_v2_typescript';

let apiKey = 'a84dba2b20613c017eff4a1185380100a385a6ff6f6939017eff4a1185380100';

export const couponApi = new CouponApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));
export const giftCertificateApi = new GiftCertificateApi(new Configuration({apiVersion: '2017-03-01', apiKey: apiKey }));

// TODO add the other apis as the samples are created.