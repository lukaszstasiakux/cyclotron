<?php

  header("Access-Control-Allow-Origin: *");
  $rest_json = file_get_contents("php://input");
  $_POST = json_decode($rest_json, true);

  $consumerKey = $_POST['apiKey'];
  $consumerSecret = $_POST['secretKey'];
  $oauth_token = $_POST['oauth_token'];
  $oauth_token_secret = $_POST['oauth_token_secret'];

  $requestTokenUrl = "https://api.flickr.com/services/rest"; 
  $oauthTimestamp = time();
  $nonce = md5(mt_rand()); 
  $oauthSignatureMethod = "HMAC-SHA1"; 
  $oauthVersion = "1.0";
  
  $sigBase = "GET&" . rawurlencode($requestTokenUrl) . "&"
  . rawurlencode("format=json"
  . "&method=" . rawurlencode('flickr.test.login')
  . "&nojsoncallback=1"
  . "&oauth_consumer_key=" . rawurlencode($consumerKey)
  . "&oauth_nonce=" . rawurlencode($nonce)
  . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
  . "&oauth_timestamp=" . $oauthTimestamp
  . "&oauth_token=" . rawurlencode($oauth_token));

  $sigKey = $consumerSecret . "&" . $oauth_token_secret; 

  $oauthSig = base64_encode(hash_hmac("sha1", $sigBase, $sigKey, true));

  $requestUrl = $requestTokenUrl . "?"
      . "format=json"
      . "&nojsoncallback=1"
      . "&oauth_consumer_key=" . rawurlencode($consumerKey)
      . "&oauth_nonce=" . rawurlencode($nonce)
      . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
      . "&oauth_signature=" . rawurlencode($oauthSig)
      . "&oauth_timestamp=" . rawurlencode($oauthTimestamp)
      . "&oauth_token=" . rawurlencode($oauth_token)
      . "&method=" . rawurlencode('flickr.test.login');


       $ch = curl_init();
      
      curl_setopt($ch, CURLOPT_URL, $requestUrl);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
      $data = curl_exec($ch);
      curl_close($ch);
      
      echo $data;

?>
