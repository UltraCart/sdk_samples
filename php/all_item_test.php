<?php
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 0);
require_once __DIR__.'/../inc/conn.php';
require_once __DIR__.'/../inc/functions.php';
require_once __DIR__.'/../inc/user_model.php';
require_once __DIR__.'/../inc/supplier_model.php';
?>
<!DOCTYPE html>
<html>
    	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <link href='../inc/bootstrap/startbootstrap-bare-gh-pages/css/bootstrap.css' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/pagination.css"/>
	<link rel="stylesheet" type="text/css" href="popup-window.css" />
	<script src="//maps.googleapis.com/maps/api/js?key=AIzaSyCM3xOKREfsCVIqK7NJJgNURlp6nLHXtUo" async="" defer="defer" type="text/javascript"></script>
<body>

<?php
// the lack of named parameters makes querying for orders a royal mess given the large function parameter list.
// this helper method shortens the usage by taking an array and translating it.
function get_items(ultracart\v2\api\ItemApi $api, array $params)
{

echo print_r($params);

        $accounting = isset($params['accounting']) ? $params['accounting'] : null;
        $amember = isset($params['amember']) ? $params['amember'] : null;
        $auto_order = isset($params['auto_order']) ? $params['auto_order'] : null;
        $ccbill = isset($params['ccbill']) ? $params['ccbill'] : null;
        $channel_partner_mappings = isset($params['channel_partner_mappings']) ? $params['channel_partner_mappings'] : null;
        $chargeback = isset($params['chargeback']) ? $params['chargeback'] : null;
        $checkout = isset($params['checkout']) ? $params['checkout'] : null;
        $content = isset($params['content']) ? $params['content'] : null;
        $creation_dts = isset($params['creation_dts']) ? $params['creation_dts'] : null;
        $description = isset($params['description']) ? $params['description'] : null;
        $description_translated_text_instance_oid = isset($params['description_translated_text_instance_oid']) ? $params['description_translated_text_instance_oid'] : null;
        $digital_delivery = isset($params['digital_delivery']) ? $params['digital_delivery'] : null;
        $ebay = isset($params['ebay']) ? $params['ebay'] : null;
        $email_notifications = isset($params['email_notifications']) ? $params['email_notifications'] : null;
        $enrollment123 = isset($params['enrollment123']) ? $params['enrollment123'] : null;
        $gift_certificate = isset($params['gift_certificate']) ? $params['gift_certificate'] : null;
        $google_product_search = isset($params['google_product_search']) ? $params['google_product_search'] : null;
        $identifiers = isset($params['identifiers']) ? $params['identifiers'] : null;
        $inactive = isset($params['inactive']) ? $params['inactive'] : null;
        $instant_payment_notifications = isset($params['instant_payment_notifications']) ? $params['instant_payment_notifications'] : null;
        $internal = isset($params['internal']) ? $params['internal'] : null;
        $kit = isset($params['kit']) ? $params['kit'] : null;
        $kit_definition = isset($params['kit_definition']) ? $params['kit_definition'] : null;
        $last_modified_dts = isset($params['last_modified_dts']) ? $params['last_modified_dts'] : null;
        $merchant_id = isset($params['merchant_id']) ? $params['merchant_id'] : null;
        $merchant_item_id = isset($params['merchant_item_id']) ? $params['merchant_item_id'] : null;
        $merchant_item_oid = isset($params['merchant_item_oid']) ? $params['merchant_item_oid'] : null;
        $options = isset($params['options']) ? $params['options'] : null;
        $parent_category_id = isset($params['parent_category_id']) ? $params['parent_category_id'] : null;
        $payment_processing = isset($params['payment_processing']) ? $params['payment_processing'] : null;
        $physical = isset($params['physical']) ? $params['physical'] : null;
        $pricing = isset($params['pricing']) ? $params['pricing'] : null;
        $realtime_pricing = isset($params['realtime_pricing']) ? $params['realtime_pricing'] : null;
        $related = isset($params['related']) ? $params['related'] : null;
        $reporting = isset($params['reporting']) ? $params['reporting'] : null;
        $restriction = isset($params['restriction']) ? $params['restriction'] : null;
        $revguard = isset($params['revguard']) ? $params['revguard'] : null;
        $reviews = isset($params['reviews']) ? $params['reviews'] : null;
        $salesforce = isset($params['salesforce']) ? $params['salesforce'] : null;
        $shipping = isset($params['shipping']) ? $params['shipping'] : null;
        $tax = isset($params['tax']) ? $params['tax'] : null;
        $third_party_email_marketing = isset($params['third_party_email_marketing']) ? $params['third_party_email_marketing'] : null;
        $variant_items = isset($params['variant_items']) ? $params['variant_items'] : null;
        $variations = isset($params['variations']) ? $params['variations'] : null;
        $wishlist_member = isset($params['wishlist_member']) ? $params['wishlist_member'] : null;

    return $api->getItems($amember, $auto_order, $ccbill, $channel_partner_mappings, $chargeback, $checkout, $content, $creation_dts, $description, $description_translated_text_instance_oid, $digital_delivery, $ebay, $email_notifications, $enrollment123, $gift_certificate, $google_product_search, $identifiers, $inactive, $instant_payment_notifications, $internal, $kit, $kit_definition, $last_modified_dts, $merchant_id, $merchant_item_id, $merchant_item_oid, $options, $parent_category_id, $payment_processing, $physical, $pricing, $realtime_pricing, $related, $reporting, $restriction, $revguard, $reviews, $salesforce, $shipping, $tax, $third_party_email_marketing, $variant_items, $variations, $wishlist_member);
}



error_reporting(E_ALL);
require_once(__DIR__ . '/SwaggerClient-php/autoload.php');
require_once(__DIR__ . '/SwaggerClient-php/lib/api/ItemApi.php');
$simple_key = 'd5155ca4484724015d5ca490e405160072cbe7eb43a11a015d5ca490e4051600';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);
ultracart\v2\Configuration::getDefaultConfiguration()->addDefaultHeader("X-UltraCart-Api-Version", "2017-03-01");
$item_expansion = "pricing"; 
$item_api = new ultracart\v2\api\ItemApi();
$items_response = get_orders($item_api, ['_expand' => $item_expansion]);

//$order_id = $_GET["order_platform_id"];
//$order_id = "XDWEX-201707312337-233766";

//$order_expansion = "shipping,billing,item,summary,payment,coupon,taxes"; // see www.ultracart.com/api/ for all the expansion fields available
//$item_api = new \ultracart\v2\api\OrderApi();


// To query based on a field, such as email, use this:

 $items_response = $order_api->getItems($item_expansion);
 
if ($items_response->getError() != null) {
    $items_response->getError()->getDeveloperMessage();
    $items_response->getError()->getUserMessage();
}
$items = $items_response->getItems();
$item_response = $item_api->getItems();
echo print_r($items);
 
if ($item_response->getSuccess()) {

      if(!is_null($items)){
        foreach($items as $item){
		$merchantId = $item->getMerchantId();
		echo $merchantId."<br />aw";
        }
      }

}
else{
    $item_response->getError()->getDeveloperMessage();
	$item_response->getError()->getUserMessage();	
	
}

?>

</body>