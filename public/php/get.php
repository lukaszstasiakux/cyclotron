<?php
header("Access-Control-Allow-Origin: *");
$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

$consumerKey = $_POST['apiKey'];
$consumerSecret = $_POST['secretKey'];

$requestTokenUrl = "https://www.flickr.com/services/oauth/request_token"; 
$oauthTimestamp = time();
$nonce = md5(mt_rand()); 
$oauthSignatureMethod = "HMAC-SHA1"; 
$oauthVersion = "1.0";

$sigBase = "GET&" . rawurlencode($requestTokenUrl) . "&"
    . rawurlencode("oauth_consumer_key=" . rawurlencode($consumerKey)
    . "&oauth_nonce=" . rawurlencode($nonce)
    . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
    . "&oauth_timestamp=" . $oauthTimestamp
    . "&oauth_version=" . $oauthVersion);

$sigKey = $consumerSecret . "&"; 
$oauthSig = base64_encode(hash_hmac("sha1", $sigBase, $sigKey, true));

$requestUrl = $requestTokenUrl . "?"
    . "oauth_consumer_key=" . rawurlencode($consumerKey)
    . "&oauth_nonce=" . rawurlencode($nonce)
    . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
    . "&oauth_timestamp=" . rawurlencode($oauthTimestamp)
    . "&oauth_version=" . rawurlencode($oauthVersion)
    . "&oauth_signature=" . rawurlencode($oauthSig); 

$response = file_get_contents($requestUrl);
$oauth_token = explode("&",$response,-1);

$requestTokenUrl2 = "https://www.flickr.com/services/oauth/authorize";

$requestUrl2 = $requestTokenUrl2 ."?". $oauth_token[1] . "&perms=write";

$obj = (object) array('url' => $requestUrl2, 'token' => $response);
echo json_encode($obj) ;


