<?php

use ultracart\v2\api\GiftCertificateApi;
use ultracart\v2\models\GiftCertificateQuery;

require_once '../vendor/autoload.php';
require_once '../constants.php';


$gift_certificate_api = ultracart\v2\api\GiftCertificateApi::usingApiKey(Constants::API_KEY);


function getGiftCertificateChunk(GiftCertificateApi $gift_certificate_api, int $offset, int $limit): array
{
    $expansion = "ledger";
    $query = new GiftCertificateQuery();  // leave this empty to retrieve all records.
    $api_response = $gift_certificate_api->getGiftCertificatesByQuery($query, $limit, $offset, null, null, $expansion);
    if($api_response->getGiftCertificates() != null){
        return $api_response->getGiftCertificates();
    }
    return [];
}

$gift_certificates = [];

$iteration = 1;
$offset = 0;
$limit = 200;
$more_records_to_fetch = true;

while( $more_records_to_fetch ){

    echo "executing iteration " . $iteration . '<br>';
    $chunk_of_certificates = getGiftCertificateChunk($gift_certificate_api, $offset, $limit);
    $gift_certificates = array_merge($gift_certificates, $chunk_of_certificates);
    $offset = $offset + $limit;
    $more_records_to_fetch = count($chunk_of_certificates) == $limit;
    $iteration++;

}

echo '<html lang="en"><body><pre>';
var_dump($gift_certificates);
echo '</pre></body></html>';

