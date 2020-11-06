<?php
require_once(__DIR__ . '/SwaggerClient-php/autoload.php');

ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
ultracart\v2\Configuration::getDefaultConfiguration()->addDefaultHeader("X-UltraCart-Api-Version", "2017-03-01");

$api_instance = new ultracart\v2\api\CustomerApi();
$customer_profile_oid = 1234567; // int | The customer oid to retrieve.

try {
    $result = $api_instance->getCustomer($customer_profile_oid);
    print_r($result);
} catch (\ultracart\v2\ApiException $e) {
    echo 'Exception when calling CustomerApi->getCustomer: ', $e->getMessage(), PHP_EOL;
    print_r($e->getResponseObject());
}
