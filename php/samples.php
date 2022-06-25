<?php

require_once 'constants.php';
use ultracart\v2\api\GiftCertificateApi;
use ultracart\v2\api\OrderApi;

class Samples{


    public static function getGiftCertificateApi(): GiftCertificateApi{
        return GiftCertificateApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS,
            Constants::VERIFY_SSL, Constants::DEBUG);
    }


    public static function getOrderApi():OrderApi{
        return OrderApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS,
            Constants::VERIFY_SSL, Constants::DEBUG);
    }

}