<?php

$basedir = '/home/mdhwareh/public_html/tools/ultracart';

set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
//error_reporting(E_ALL);

date_default_timezone_set('America/New_York');

require_once($basedir. '/rest_api_v2_sdk_php-master/vendor/autoload.php'); // composer
require_once($basedir. '/rest_api_v2_sdk_php-master/autoload.php');
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', '79858820020464015cc18e2966051b008410a8d10ef429015cc18e2966051b00');

$client = new GuzzleHttp\Client(['verify' => true, 'debug' => false]);
$config = ultracart\v2\Configuration::getDefaultConfiguration();
$headerSelector = new \ultracart\v2\HeaderSelector(/* leave null for version tied to this sdk version */);

$order_api = new ultracart\v2\api\OrderApi($client, $config, $headerSelector); // needed
$api_instance = new ultracart\v2\api\OrderApi($client, $config, $headerSelector); // needed
$order_query = new ultracart\v2\models\OrderQuery();

$_expand = "affiliate,affiliate.ledger,auto_order,billing,buysafe,channel_partner,checkout,coupon,customer_profile,digital_order,edi,fraud_score,gift,gift_certificate,internal,item,linked_shipment,marketing,payment,payment.transaction,quote,salesforce,shipping,summary,taxes"; // string | The object expansion to perform on the result.
	

$stagemap=array(
'Accounts Receivable'=>'AR',
'Completed Order'=>'CO',
'Fraud Review'=>'FR',
'Pending Clearance'=>'PC',
'Purchase Order'=>'PO',
'Quote Request'=>'QR',
'Quote Sent'=>'QS',
'Rejected'=>'REJ',
'Shipping Department'=>'SD',
'Unknown'=>'UNK',
);
	
?>