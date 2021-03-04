<?php

require_once '../vendor/autoload.php';
$simple_key = '109ee846ee69f50177018ab12f008a00748a25aa28dbdc0177018ab12f008a00';
$item_api = ultracart\v2\api\ItemApi::usingApiKey($simple_key);

$new_item = new \ultracart\v2\models\Item();
$new_item->setMerchantItemId('my_item_id_3');

$pricing = new \ultracart\v2\models\ItemPricing();
$pricing->setCost(9.99);
$new_item->setPricing($pricing);

$new_item->setDescription('This item is sure to change your life for the better!');

$multimedia = new \ultracart\v2\models\ItemContentMultimedia();
$multimedia->setUrl('https://upload.wikimedia.org/wikipedia/en/7/73/Mr._Clean_logo.png');
$multimedia->setCode('default'); // <-- use 'default' to make this the default item.
$multimedia->setDescription('Some random image i nabbed from wikipedia');


$content = new \ultracart\v2\models\ItemContent();
$content->setMultimedia([$multimedia]); // <- notice this is an array
$new_item->setContent($content);

$expand = 'content.multimedia'; // I want to see the multimedia returned on the newly created object.

$api_response = $item_api->insertItem($new_item, $expand);
echo '<html lang="en"><body><pre>';
var_dump($api_response);
// var_dump($api_response->getCoupon());
echo '</pre></body></html>';
?>
