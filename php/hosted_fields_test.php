<?php
    require_once(__DIR__ . '/HostedFields.class.php');
?>
<html>
<body>
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$merchantId = "DEMO";
$cartId = "12345678901234567890123456789012";
$hosted_fields = new HostedFields($merchantId, $cartId);
$credit_card_number = "4444333322221111";
$cvv = "890";
$cc_result = $hosted_fields->store_number($credit_card_number);
$cvv_result = $hosted_fields->store_cvv($cvv);
?>
<pre>
<?php echo $hosted_fields->public_key ?><br>
    <?php echo $credit_card_number ?><br>
    <?php echo $cvv ?><br>
    <?php echo print_r($cc_result, true) ?><br>
    <?php echo print_r($cvv_result, true) ?><br>
</pre>
</body>
</html>

