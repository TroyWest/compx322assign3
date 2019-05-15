<?php
    $lat =  $_GET["lat"];
    $long = $_GET["long"];

    $curl_request = curl_init("https://api.sunrise-sunset.org/json?lat=".$lat."&lng=".$long."&formatted=0");

    curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, TRUE);

    $result = curl_exec($curl_request);

    echo $result;

    curl_close($curl_request);


?>