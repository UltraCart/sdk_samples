<?php

ini_set('display_errors', 1);

/*
 * =====================================================================================================================
 * updateAutoOrderCreditCard.php
 * =====================================================================================================================
 *
 * This sample updates the credit card on an existing auto order.  It is more involved than most of the samples in
 * this directory because it also demonstrates collecting a NEW credit card from the end customer in a PCI compliant
 * way using UltraCart Hosted Credit Card Fields.
 *
 * The card number and CVV are never seen or handled by this PHP script.  Instead, the browser uploads those values
 * directly to the UltraCart token vault (via the hosted fields JavaScript).  The vault returns two opaque tokens
 * (one for the card number, one for the CVV).  Only those tokens are POSTed back to this script, which then applies
 * them to the auto order's underlying order.
 *
 * Documentation:
 *   Hosted Fields:  https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/1377775/UltraCart+Hosted+Credit+Card+Fields
 *   Working sample: https://github.com/UltraCart/sdk_samples/blob/master/hosted_fields/hosted_fields.html
 *
 * Flow:
 *   1) GET  - render a form containing the hosted (PCI) card number and CVV fields, plus plain expiration and card
 *             type fields (expiration/card type are NOT sensitive, so they are ordinary form fields).
 *   2) The customer types their card details.  The hosted fields JavaScript uploads the number and CVV to the token
 *      vault and populates two hidden token fields with the returned tokens.
 *   3) POST - when the two token fields are present, this script:
 *        a) Loads the auto order (by a hardcoded auto_order_oid) to discover the original order id.
 *        b) Loads that original order with the payment expansion.
 *        c) Applies the new tokens (and expiration / card type) to order.payment.credit_card and updates the order.
 *
 *      The auto order rebills using the payment information stored on its original order, so updating the credit card
 *      on the original order is what changes the card used for all future recurring charges.
 *
 * =====================================================================================================================
 */

require_once '../vendor/autoload.php';
require_once '../samples.php';

use ultracart\v2\models\OrderPaymentCreditCard;

// ---------------------------------------------------------------------------------------------------------------------
// Configuration.  In a real integration these would be derived from the logged in customer's session, not hardcoded.
// ---------------------------------------------------------------------------------------------------------------------
$auto_order_oid = 123456789;   // The auto order whose credit card we are updating.
$merchant_id = 'DEMO';         // Your UltraCart merchant id.  Used by the hosted fields JavaScript (window.ucMerchantId).

// The valid card type values accepted by the API (see OrderPaymentCreditCard card type constants).
$card_types = array(
    OrderPaymentCreditCard::CARD_TYPE_VISA,
    OrderPaymentCreditCard::CARD_TYPE_MASTER_CARD,
    OrderPaymentCreditCard::CARD_TYPE_AMEX,
    OrderPaymentCreditCard::CARD_TYPE_DISCOVER,
    OrderPaymentCreditCard::CARD_TYPE_DINERS_CLUB,
    OrderPaymentCreditCard::CARD_TYPE_JCB,
);

// ---------------------------------------------------------------------------------------------------------------------
// Read the values the browser submits back to us.  The two *_token fields are populated by the hosted fields JS.
// The card number and CVV themselves are never sent to this script.
// ---------------------------------------------------------------------------------------------------------------------
$card_number_token = $_POST['cardNumberToken'] ?? '';
$cvv2_token = $_POST['cvv2Token'] ?? '';
$card_type = $_POST['cardType'] ?? '';
$exp_month = (int)($_POST['cardExpirationMonth'] ?? 0);
$exp_year = (int)($_POST['cardExpirationYear'] ?? 0);

// If both tokens are present, perform the update.  Otherwise fall through and render the collection form.
if ($card_number_token !== '' && $cvv2_token !== '') {
    updateAutoOrderCreditCard($auto_order_oid, $card_number_token, $cvv2_token, $card_type, $exp_month, $exp_year);
    exit();
}


/**
 * Applies the new credit card tokens to the auto order's original order.
 *
 * @param int $auto_order_oid The auto order to update.
 * @param string $card_number_token Token returned by the vault for the card number.
 * @param string $cvv2_token Token returned by the vault for the CVV.
 * @param string $card_type One of the OrderPaymentCreditCard::CARD_TYPE_* values.
 * @param int $exp_month Card expiration month (1-12).
 * @param int $exp_year Card expiration year (4 digit, e.g. 2029).
 */
function updateAutoOrderCreditCard($auto_order_oid, $card_number_token, $cvv2_token, $card_type, $exp_month, $exp_year)
{
    $auto_order_api = Samples::getAutoOrderApi();
    $order_api = Samples::getOrderApi();

    echo '<html lang="en"><body><pre>';

    // -----------------------------------------------------------------------------------------------------------------
    // Step 1. Load the auto order to discover the original order id.
    // We only need the original_order_id here, so a minimal expansion keeps the payload small.
    // -----------------------------------------------------------------------------------------------------------------
    $auto_order_response = $auto_order_api->getAutoOrder($auto_order_oid, 'original_order');

    if ($auto_order_response->getError() != null) {
        error_log($auto_order_response->getError()->getDeveloperMessage());
        echo 'Error loading auto order: ' . $auto_order_response->getError()->getUserMessage();
        echo '</pre></body></html>';
        return;
    }

    $auto_order = $auto_order_response->getAutoOrder();
    $original_order_id = $auto_order->getOriginalOrderId();
    echo "Auto order {$auto_order_oid} original order id: {$original_order_id}\n";

    // -----------------------------------------------------------------------------------------------------------------
    // Step 2. Load the original order with the payment expansion so we can modify the credit card.
    // -----------------------------------------------------------------------------------------------------------------
    $order_expansion = 'payment';
    $order_response = $order_api->getOrder($original_order_id, $order_expansion);

    if ($order_response->getError() != null) {
        error_log($order_response->getError()->getDeveloperMessage());
        echo 'Error loading order: ' . $order_response->getError()->getUserMessage();
        echo '</pre></body></html>';
        return;
    }

    $order = $order_response->getOrder();

    // -----------------------------------------------------------------------------------------------------------------
    // Step 3. Apply the new tokens (and expiration / card type) to order.payment.credit_card and update the order.
    // -----------------------------------------------------------------------------------------------------------------
    $credit_card = $order->getPayment()->getCreditCard();
    if ($credit_card === null) {
        // The order may not have been paid by credit card originally.  Create the object so we can set the card.
        $credit_card = new OrderPaymentCreditCard();
        $order->getPayment()->setCreditCard($credit_card);
    }

    $credit_card->setCardNumberToken($card_number_token);
    $credit_card->setCardVerificationNumberToken($cvv2_token);

    if ($card_type !== '') {
        $credit_card->setCardType($card_type);
    }
    if ($exp_month > 0) {
        $credit_card->setCardExpirationMonth($exp_month);
    }
    if ($exp_year > 0) {
        $credit_card->setCardExpirationYear($exp_year);
    }

    // Also make sure the order is flagged as paid by credit card.
    $order->getPayment()->setPaymentMethod('Credit Card');

    $update_response = $order_api->updateOrder($original_order_id, $order, $order_expansion);

    if ($update_response->getError() != null) {
        error_log($update_response->getError()->getDeveloperMessage());
        echo 'Error updating order: ' . $update_response->getError()->getUserMessage();
        echo '</pre></body></html>';
        return;
    }

    echo "\nCredit card updated successfully for order {$original_order_id}.\n\n";
    var_dump($update_response->getOrder()->getPayment());
    echo '</pre></body></html>';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Update Auto Order Credit Card</title>

    <script type="text/javascript">
        window.ucMerchantId = '<?php echo htmlspecialchars($merchant_id, ENT_QUOTES); ?>';
    </script>

    <script type="text/javascript" src="https://secure.ultracart.com/js/json3.min.js"></script>
    <script type="text/javascript" src="https://secure.ultracart.com/js/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="https://token.ultracart.com/checkout/checkout-hosted-fields-1.0.js"></script>

    <!-- ============================================================================= -->
    <!-- BEGIN PCI compliance code                                                     -->
    <!-- The card number and CVV fields below are overlaid by secure UltraCart hosted  -->
    <!-- fields.  Their values are uploaded directly to the token vault, never to this -->
    <!-- server.  The vault populates the hidden *Token fields with the return values. -->
    <!-- See: http://docs.ultracart.com/display/ucdoc/UltraCart+PCI+Compliance         -->
    <!-- ============================================================================= -->
    <style type="text/css">
        /* Set an explicit border on the card fields so the hosted fields can mimic them when overlaying. */
        select, input {
            border: 1px solid rgb(169, 169, 169);
        }

        body {
            font-family: Arial, sans-serif;
        }

        label {
            display: inline-block;
            width: 160px;
        }

        .row {
            margin-bottom: 10px;
        }
    </style>

    <script type="text/javascript">

        var hostedFields = null;

        // setupSecureCreditCardFields should be called each time the UI renders.
        function setupSecureCreditCardFields() {
            window.ultraCartHostedFieldsDebugMode = false; // set true for verbose debugging (usually only UltraCart support).
            hostedFields = UltraCartHostedFields.setup(jQuery, JSON3, {
                'sessionCredentials': {
                    'merchantId': window.ucMerchantId
                },
                'hostedFields': {
                    'creditCardNumber': {
                        'selector': '#cardNumber'            // the field the customer types into
                        , 'tokenSelector': '#cardNumberToken' // hidden field populated with the returned token
                    },
                    'creditCardCvv2': {
                        'selector': '#cvv2'
                        , 'tokenSelector': '#cvv2Token'
                    }
                }
            });
        }

        // teardownSecureCreditCardFields should be called when the UI needs destroying.
        function teardownSecureCreditCardFields() {
            if (hostedFields !== null) {
                hostedFields.destroy();
                hostedFields = null;
            }
        }

        jQuery(document).ready(function () {
            setupSecureCreditCardFields();

            // Only allow submission once both tokens have been populated by the vault.
            jQuery('#ccForm').on('submit', function (e) {
                if (!jQuery('#cardNumberToken').val() || !jQuery('#cvv2Token').val()) {
                    e.preventDefault();
                    alert('Please enter a valid card number and CVV.  The secure token fields have not been populated yet.');
                }
            });
        });

    </script>
    <!-- END PCI compliance code -->
</head>
<body>
<h1>Update Auto Order Credit Card</h1>
<p>Updating credit card for auto order oid: <strong><?php echo (int)$auto_order_oid; ?></strong></p>

<form id="ccForm" method="post" action="">
    <div class="row">
        <label for="cardType">Card Type:</label>
        <select id="cardType" name="cardType">
            <?php foreach ($card_types as $type): ?>
                <option value="<?php echo htmlspecialchars($type, ENT_QUOTES); ?>"><?php echo htmlspecialchars($type, ENT_QUOTES); ?></option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="row">
        <label for="cardNumber">Card Number:</label>
        <input id="cardNumber" maxlength="30" autocomplete="off"/>
    </div>

    <div class="row">
        <label for="cvv2">CVV:</label>
        <input id="cvv2" maxlength="4" autocomplete="off"/>
    </div>

    <div class="row">
        <label for="cardExpirationMonth">Expiration Month:</label>
        <select id="cardExpirationMonth" name="cardExpirationMonth">
            <?php for ($m = 1; $m <= 12; $m++): ?>
                <option value="<?php echo $m; ?>"><?php echo str_pad($m, 2, '0', STR_PAD_LEFT); ?></option>
            <?php endfor; ?>
        </select>
    </div>

    <div class="row">
        <label for="cardExpirationYear">Expiration Year:</label>
        <select id="cardExpirationYear" name="cardExpirationYear">
            <?php $start_year = (int)date('Y'); for ($y = $start_year; $y <= $start_year + 12; $y++): ?>
                <option value="<?php echo $y; ?>"><?php echo $y; ?></option>
            <?php endfor; ?>
        </select>
    </div>

    <!-- These hidden fields are populated by the hosted fields JavaScript with the vault tokens. -->
    <input type="hidden" id="cardNumberToken" name="cardNumberToken"/>
    <input type="hidden" id="cvv2Token" name="cvv2Token"/>

    <div class="row">
        <button type="submit">Update Credit Card</button>
    </div>
</form>
</body>
</html>
