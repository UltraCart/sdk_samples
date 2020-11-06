<?php

set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
?>
<!DOCTYPE html>
<html>
<body>
<?php

error_reporting(E_ALL);
require_once(__DIR__ . '/SwaggerClient-php/autoload.php');
$simple_key = '508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);
ultracart\v2\Configuration::getDefaultConfiguration()->addDefaultHeader("X-UltraCart-Api-Version", "2017-03-01");

$order_api = new ultracart\v2\api\OrderApi();


$order_id = null;
$payment_method = null;
$company = null;
$first_name = null;
$last_name = null;
$city = null;
$state_region = null;
$postal_code = null;
$country_code = null;
$phone = null;
$email = null;
$cc_email = null;
$total = null;
$screen_branding_theme_code = null;
$storefront_host_name = null;
$creation_date_begin = null;
$creation_date_end = null;
$payment_date_begin = null;
$payment_date_end = null;
$shipment_date_begin = null;
$shipment_date_end = null;
$rma = null;
$purchase_order_number = null;
$item_id = null;
$current_stage = "Rejected";
$channel_partner_code = null;
$channel_partner_order_id = null;
$_limit = null;
$_offset = null;
$_sort = "order_id";
$_expand = null;

$order_response = $order_api->getOrders($order_id, $payment_method, $company, $first_name, $last_name, $city, $state_region, $postal_code, $country_code, $phone, $email, $cc_email, $total, $screen_branding_theme_code, $storefront_host_name, $creation_date_begin, $creation_date_end, $payment_date_begin, $payment_date_end, $shipment_date_begin, $shipment_date_end, $rma, $purchase_order_number, $item_id, $current_stage, $channel_partner_code, $channel_partner_order_id, $_limit, $_offset, $_sort, $_expand);
$orders = $order_response->getOrders();

?>
<pre>
<?php echo print_r($orders); ?>
<?php echo print_r($order_response); ?>
</pre>
<?php echo 'Finished.'; ?>
</body>
</html>

