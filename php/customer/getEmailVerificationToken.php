<?php

ini_set('display_errors', 1);

/*
    getEmailVerificationToken and validateEmailVerificationToken are tandem functions that allow a merchant to verify
    a customer's email address. getEmailVerificationToken returns back a token that the merchant can use however
    they wish to present to a customer. Usually this will be emailed to the customer within instructions to enter
    it back into a website.  Once the customer enters the token back into a site (along with their email),
    validateEmailVerificationToken will validate the token.

    Notice that getEmailVerificationToken requires both the email and password.

 */


use ultracart\v2\api\CustomerApi;
use ultracart\v2\models\AdjustInternalCertificateRequest;
use ultracart\v2\models\EmailVerifyTokenRequest;
use ultracart\v2\models\EmailVerifyTokenValidateRequest;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$customer_api = CustomerApi::usingApiKey(Constants::API_KEY);


$email = "test@ultracart.com";
$password = "squirrel";

$tokenRequest = new EmailVerifyTokenRequest();
$tokenRequest->setEmail($email);
$tokenRequest->setPassword($password);

$tokenResponse = $customer_api->getEmailVerificationToken($tokenRequest);
$token = $tokenResponse->getToken();

// TODO - email the token to the customer, have them enter it back into another page...
// TODO - verify the token with the following call

$verifyRequest = new EmailVerifyTokenValidateRequest();
$verifyRequest->setToken($token);
$verifyResponse = $customer_api->validateEmailVerificationToken($verifyRequest);

echo 'Was the correct token provided? ' . $verifyResponse->getSuccess();