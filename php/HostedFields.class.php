<?php

class HostedFields
{
    function __construct(string $merchantId, string $cartId = null)
    {
        $this->merchantId = $merchantId;
        $this->cartId = $cartId;
        $this->public_key = $this->get_public_key();

        echo "HostedFields() called<br>";
        echo "Merchant ID: " . $merchantId . "<br>";
        echo "Cart ID: " . $cartId . "<br>";
    }

    private $url = "https://token.ultracart.com/cgi-bin/UCCheckoutAPIHostedFields";
    private $public_key_url = "https://token.ultracart.com/cgi-bin/UCCheckoutAPIHostedFieldsPublicKey";
    private $referrer = 'https://token.ultracart.com/';
    private $merchantId;
    private $version = '1.0';
    private $cartId;
    public $public_key;

    public function get_public_key()
    {
        $ch = curl_init();
        $timeout = 50;
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:'));
        curl_setopt($ch, CURLOPT_URL, $this->public_key_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // remove for production
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }


    public function store_number($credit_card_number)
    {
        $timestamp = time() * 1000; // need milliseconds
        $unencrypted_cc_payload = "$credit_card_number|$timestamp";
        openssl_public_encrypt($unencrypted_cc_payload, $encrypted_cc_payload, $this->public_key);
        $base64_cc_payload = base64_encode($encrypted_cc_payload);

        echo "\n\n";
        echo $base64_cc_payload;
        echo "\n\n";

        $operation = 'storeCreditCardNumber';
        $creditCardNumberEncrypted = $base64_cc_payload;

        $cc_data = array("merchantId" => $this->merchantId,
            "operation" => $operation,
            "version" => $this->version,
            "creditCardNumberEncrypted" => $creditCardNumberEncrypted,
            "referrer" => $this->referrer);

        if(isset($this->cartId)){
            $cvv_data["shoppingCartId"] = $this->cartId;
        }


        $cc_result = json_decode($this->post_to_token_vault($cc_data, $this->url));
        return $cc_result;
    }



    public function store_cvv($cvv)
    {
        $timestamp = time() * 1000; // need milliseconds
        $unencrypted_cvv_payload = "$cvv|$timestamp";
        openssl_public_encrypt($unencrypted_cvv_payload, $encrypted_cvv_payload, $this->public_key);
        $base64_cvv_payload = base64_encode($encrypted_cvv_payload);

        echo "\n\n";
        echo $base64_cvv_payload;
        echo "\n\n";


        $operation = "storeCreditCardCvv2";
        $creditCardCvv2Encrypted = $base64_cvv_payload;

        $cvv_data = array("merchantId" => $this->merchantId,
            "operation" => $operation,
            "version" => $this->version,
            "creditCardCvv2Encrypted" => $creditCardCvv2Encrypted,
            "referrer" => $this->referrer);

        if(isset($this->cartId)){
            $cvv_data["shoppingCartId"] = $this->cartId;
        }

        $cvv_result = json_decode($this->post_to_token_vault($cvv_data, $this->url));
        return $cvv_result;
    }


    private function post_to_token_vault($data, $url)
    {
        // $data = array("name" => "Hagrid", "age" => "36");
        // $data_string = json_encode($data);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Referer: https://token.ultracart.com/'));
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

}