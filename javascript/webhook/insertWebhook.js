process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // -- development code only

const ucApi = require("ultra_cart_rest_api_v2");
const { apiClient } = require('../api.js');

var webhookApi = new ucApi.WebhookApi(apiClient);

var webhook = new ucApi.Webhook(); // Webhook | Webhook to create
webhook.webhook_url = "https://www.mywebhook-url.com/webhooks/ultracart/some/path/script.jsp"
webhook.authentication_type = 'none'

var opts = {
    '_placeholders': true
};

var callback = function(error, data, response) {
    if (error) {
        console.error(error);
    } else {
        console.log('API called successfully. Returned data: ' + data);
    }
};
webhookApi.insertWebhook(webhook, opts, callback);
