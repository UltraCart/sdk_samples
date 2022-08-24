<?php

require_once 'constants.php';

use ultracart\v2\api\CustomerApi;
use ultracart\v2\api\GiftCertificateApi;
use ultracart\v2\api\OrderApi;
use ultracart\v2\api\ItemApi;

class Samples
{


    public static function getGiftCertificateApi(): GiftCertificateApi
    {
        return GiftCertificateApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS,
            Constants::VERIFY_SSL, Constants::DEBUG);
    }


    public static function getOrderApi(): OrderApi
    {
        return OrderApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS,
            Constants::VERIFY_SSL, Constants::DEBUG);
    }


    public static function getItemApi(): ItemApi
    {
        return ItemApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS,
            Constants::VERIFY_SSL, Constants::DEBUG);
    }

    public static function getCustomerApi(): CustomerApi
    {
        return CustomerApi::usingApiKey(Constants::API_KEY, Constants::MAX_RETRY_SECONDS,
            Constants::VERIFY_SSL, Constants::DEBUG);
    }


}