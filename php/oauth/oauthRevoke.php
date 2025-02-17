<?php

use ultracart\v2\api\OauthApi;

ini_set('display_errors', 1);

/*

This is a last feature of the UltraCart OAuth Security Implementation.
oauthRevoke is used to kill an access token.
Call this method when a customer desires to terminate using your Developer Application.


The first step in implementing an OAuth authorization to your UltraCart Developer Application is
creating a Client ID and Secret.  See the following doc for instructions on doing so:
https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/3488907265/Developer+Applications+-+Creating+a+Client+ID+and+Secret+for+an+OAuth+Application

 */

$clientId = "5e31ce86e17f02015a35257c47151544";  // this is given to you when you create your application (see the doc link above)
$accessToken = "123456789012345678901234567890"; // this is stored by your application somewhere somehow.

$oauth_api = OauthApi::usingApiKey(Constants::API_KEY);
$api_response = $oauth_api->oauthRevoke($clientId, $accessToken);

// $api_response is an OauthRevokeSuccessResponse object.
var_dump($api_response);
$successful = $api_response->getSuccessful();
$message = $api_response->getMessage();