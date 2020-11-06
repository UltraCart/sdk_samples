<?php
set_time_limit(3000);
ini_set('max_execution_time', 3000);
ini_set('display_errors', 1);
?>
<!DOCTYPE html>
<html>
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<link href='../inc/bootstrap/startbootstrap-bare-gh-pages/css/bootstrap.css' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="css/normalize.css">
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/pagination.css"/>
<link rel="stylesheet" type="text/css" href="popup-window.css" />
<script src="//maps.googleapis.com/maps/api/js?key=AIzaSyCM3xOKREfsCVIqK7NJJgNURlp6nLHXtUo" async="" defer="defer" type="text/javascript"></script>
<body>

<form method="post" action="./order_query.php">
    <label>Order ID: <input type="text" name="order_id"></label>
    <br>
    <br>
    <button style="width:150px;height:30px;text-align:center;vertical-align:center;" name="btn_search_oid">Search</button>
</form>
<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') // Better way to check if form submitted.
{

error_reporting(E_ALL);
require_once(__DIR__ . '/SwaggerClient-php/autoload.php');
$simple_key = '508052342b482a015d85c69048030a0005a9da7cea5afe015d85c69048030a00';
ultracart\v2\Configuration::getDefaultConfiguration()->setApiKey('x-ultracart-simple-key', $simple_key);
ultracart\v2\Configuration::getDefaultConfiguration()->addDefaultHeader("X-UltraCart-Api-Version", "2017-03-01");

$order_api = new ultracart\v2\api\OrderApi();

$order_id = $_POST["order_id"];
$order_expansion = "shipping,billing,item,summary,payment,coupon,taxes"; // see www.ultracart.com/api/ for all the expansion fields available
$order_api = new \ultracart\v2\api\OrderApi();


// To query based on a field, such as email, use this:

$order_query = new \ultracart\v2\models\OrderQuery();
$order_query->setOrderId($order_id);
$orders_response = $order_api->getOrdersByQuery($order_query, 200, 0, null,$order_expansion);

if ($orders_response->getError() != null) {
    $orders_response->getError()->getDeveloperMessage();
    $orders_response->getError()->getUserMessage();
}
$orders = $orders_response->getOrders();

// single order
$order_response = $order_api->getOrder($order_id, $order_expansion);
if ($order_response->getSuccess()) {
    $order = $order_response->getOrder();
}

foreach ($orders as $order) {
    $currentStage = $order->getCurrentStage();
    $s_addr = $order->getShipping();
    $trackingNumber = $s_addr->getTrackingNumbers();
    foreach ($trackingNumber as $tnum) {

    }
    $sfname = $s_addr -> getFirstName();
    $slname = $s_addr -> getLastName();
    $saddress1 = $s_addr->getAddress1();
    $saddress2 = $s_addr->getAddress2();
    $scity = $s_addr->getCity();
    $sregion = $s_addr->getStateRegion();
    $sccode = $s_addr->getCountryCode();
    $spcode = $s_addr->getPostalCode();
    $sdayphone = $s_addr->getDayPhone();

    $b_addr = $order->getBilling();
    $b_addr->getAddress1();
    $b_addr->getAddress2();
    $b_addr->getCity();
    $b_addr->getStateRegion();
    $b_addr->getCountryCode();
    $b_addr->getPostalCode();
    $bemail = $b_addr->getEmail(); // email is located on the billing object.

// here is how to access the items
    $items = $order->getItems();
    foreach ($items as $item) {
        $qty = $item->getQuantity();
        $itemId = $item->getMerchantItemId();
        $description = $item->getDescription();
        $cost = $item->getCost();
        $cost->getLocalized(); // cost as float.
        $realcost = $cost->getLocalizedFormatted(); // cost with symbols.
    }
}

// update the order here.

// setFirstName("Robert");

// request the same order expansion, or the updated object will not contain the same fields as the original 'get' request
$order_response = $order_api->updateOrder($order, $order_id, $order_expansion);
if ($order_response->getError() != null) {
    $order_response->getError()->getDeveloperMessage();
    $order_response->getError()->getUserMessage();
}


// here is how to access the shipping fields

?>
<pre>
    <table>
        <tr><td><h1>Order ID: <?php echo $order_id; ?></h1></td></tr>
        <tr><td><h5>Tracking Number: <?php echo $tnum; ?></h5></td></tr>
        <tr><td><h5>Current Stage: <?php echo $currentStage; ?></h5></td></tr>
    <tr><td colspan="2">----------------------------------------------------------------------------------------------------------------------------------</td></tr>
    <tr><td>Customer Name:</td><td><?php echo $sfname." ".$slname; ?> </td></tr>
    <tr><td>Email:</td><td><input type="text" value="<?php echo $bemail; ?>" size="60"> </td></tr>
    <tr><td>Day Phone:</td><td><input type="text" value="<?php echo $sdayphone; ?>" size="60"> </td></tr>
    <tr><td>Address 1:</td><td><input type="text" value="<?php echo $saddress1; ?>" size="60"></td></tr>
    <tr><td>Address 2:</td><td><input type="text" value="<?php echo $saddress2; ?>" size="60"></td></tr>
    <tr><td>City: </td><td><input type="text" value="<?php echo $scity; ?>" size="60"></td></tr>
    <tr><td>Region:</td><td><input type="text" value="<?php echo $sregion; ?>" size="60"></td></tr>
    <tr><td>Country Code:</td><td><input type="text" value="<?php echo $sccode; ?>" size="60"></td></tr>
    <tr><td>Postal Code:</td><td><input type="text" value="<?php echo $spcode; ?>" size="60"></td></tr>
    </table>
<table>
    <tr><td colspan="3">----------------------------------------------------------------------------------------------------------------------------------</td></tr>
    <tr><td colspan="3">Items Purchased:</td></tr>
    <tr><td>Item ID</td><td>Quantity</td><td>Cost</td></tr>
    <tr><td><?php echo $itemId; ?></td><td><?php echo $qty; ?></td><td><?php echo $realcost; ?></td></tr>
</table>

    <?php echo $order; ?>
</pre>
</body>
</html>
<?php
}else{
    if(isset($_POST["btn_search_oid"])){
        echo "Please type in the Order ID";
    }
}
?>
