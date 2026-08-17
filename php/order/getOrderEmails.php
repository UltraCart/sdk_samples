<?php

ini_set('display_errors', 1);

use ultracart\v2\api\OrderApi;

require_once '../vendor/autoload.php';
require_once '../constants.php';

/*
    getOrderEmails returns the delivery records for every email UltraCart sent regarding an order, oldest
    first.  Each record carries the subject and send time plus delivery, open, click and bounce status,
    which makes this useful evidence that a customer was notified about their order.

    A customer profile is NOT required.  These records are tied to the order id itself.

    An order with no email history, or one whose emails were all suppressed, comes back with an empty
    emails array.  That is a successful response rather than an error.

    The internal flag marks messages sent to merchant staff rather than to the customer.  Filter those out
    if you only want what the customer actually received.

    Possible Errors:
    order_id does not start with the merchant id -> "Path parameter 'order_id' does not start with the merchant id.  Check your parameter value and call log."

 */


$order_api = OrderApi::usingApiKey(Constants::API_KEY, false, false);


$order_id = 'DEMO-0009104976';
$emails = $order_api->getOrderEmails($order_id)->getEmails();

echo '<html lang="en"><body><pre>';

if (empty($emails)) {
    echo 'No emails were sent for this order.';
} else {
    foreach ($emails as $email) {
        echo $email->getSendDts() . ' - ' . $email->getEmail() . ' - ' . $email->getSubject() . "\n";
    }

    echo "\n";
    var_dump($emails);
}

echo '</pre></body></html>';
