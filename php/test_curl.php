<?php
/**
 * Created by PhpStorm.
 * User: perry
 * Date: 4/27/2017
 * Time: 2:51 AM
 */

$ch = curl_init();
$timeout = 50;
curl_setopt($ch, CURLOPT_URL, "https://www.google.com/");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
curl_setopt($ch, CURLOPT_VERBOSE, true);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // remove for production
$data = curl_exec($ch);
curl_close($ch);
echo $data;