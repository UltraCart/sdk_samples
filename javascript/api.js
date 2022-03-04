var ucApi = require('ultra_cart_rest_api_v2');
// var xxxSvc = new UltraCartRestApiV2.XxxApi(); // Allocate the API class we're going to use.
// var yyyModel = new UltraCartRestApiV2.Yyy(); // Construct a model instance.



let apiKey = 'a84dba2b20613c017eff4a1185380100a385a6ff6f6939017eff4a1185380100';
const apiClient = ucApi.ApiClient.instance;
apiClient.defaultHeaders['X-UltraCart-Api-Version'] = '2017-03-01';
const { authentications: { ultraCartSimpleApiKey } } = apiClient;
ultraCartSimpleApiKey.apiKey = apiKey;

// console.log('apiClient', apiClient);
module.exports = {apiClient: apiClient};