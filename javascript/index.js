// -- development code to work with UltraCart test servers.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// -- end of development code

var UltraCartRestApiV2 = require('ultra_cart_rest_api_v2');

var defaultClient = UltraCartRestApiV2.ApiClient.instance;

// Configure API key authorization: ultraCartSimpleApiKey
defaultClient.authentications['ultraCartSimpleApiKey'].apiKey = "0a4842d0f198c801706475cf15380100b575d4eb25ddeb01706475cf15380100";
defaultClient.defaultHeaders["X-UltraCart-Api-Version"] = "2017-03-01";

var api = new UltraCartRestApiV2.OrderApi();

var orderId = "DEMO-0009104344";
var opts = {
    'expand': "customer_profile,item,summary" // String | The object expansion to perform on the result.  See documentation for examples
};

var callback = function(error, data, response) {
    if (error) {
        console.error(error);
    } else {

        // data is an OrderResponse object
        var order = data.order;

        console.log('API called successfully. Returned data:');
        console.log(order);
    }
};


api.getOrder(orderId, opts, callback);
