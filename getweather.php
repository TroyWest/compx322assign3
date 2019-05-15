<?php
    $key = "d55115e87de76bb5f1680e6cba5b22f4";

    $lat =  $_GET["lat"];
    $long = $_GET["long"];

    $curl_request = curl_init("api.openweathermap.org/data/2.5/weather?lat=".$lat."&lon=".$long."&appid=".$key."&mode=xml");

    curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, TRUE);

    $result = curl_exec($curl_request);

    echo $result;

    curl_close($curl_request);


?>