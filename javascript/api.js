var ucApi = require('ultra_cart_rest_api_v2');

// sample key yo. only works in dev, so get your own.
// See this article: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
let apiKey = '506be6208aec1f017c9e54aa881f3700c39c45da408cad017c9e54aa881f3700';
const apiClient = ucApi.ApiClient.instance;
apiClient.defaultHeaders['X-UltraCart-Api-Version'] = '2017-03-01';
const { authentications: { ultraCartSimpleApiKey } } = apiClient;
ultraCartSimpleApiKey.apiKey = apiKey;

module.exports = {apiClient: apiClient};
