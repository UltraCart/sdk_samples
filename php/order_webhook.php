<?php
/**
 * Created by PhpStorm.
 * User: perry
 * Date: 5/10/2017
 * Time: 1:00 PM
 */

$json = file_get_contents('php://input');
$order_events = json_decode($json);  // array of key-value pairs.  key=event_name, value=order object.
?>
<!DOCTYPE html>
<html>
<body>

<?php foreach ($order_events as $order_event) { ?>
    <?php if (isset($order_event->order_create)) { ?>
        Order Create Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_create, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_delete)) { ?>
        Order Delete Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_delete, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_payment_process)) { ?>
        Order Payment Process Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_payment_process, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_refund)) { ?>
        Order Refund Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_refund, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_reject)) { ?>
        Order Reject Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_reject, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_ship)) { ?>
        Order Ship Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_ship, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_stage_change)) { ?>
        Order Stage Change Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_stage_change, true) ?>
        </pre>
    <?php } ?>

    <?php if (isset($order_event->order_update)) { ?>
        Order Update Event Follows:<br>
        <pre>
<?php echo print_r($order_event->order_update, true) ?>
        </pre>
    <?php } ?>

<?php } ?>


These are all of the order events.
<pre>
"order_create"
"order_delete"
"order_payment_process"
"order_refund"
"order_reject"
"order_ship"
"order_stage_change"
"order_update"
</pre>

</body>
</html>




