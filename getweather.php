<?php
    // Open weather API key
    $key = "d55115e87de76bb5f1680e6cba5b22f4";

    // Get variables from query string
    $lat =  $_GET["lat"];
    $long = $_GET["long"];

    // Set up and execute cURL request
    $curl_request = curl_init("api.openweathermap.org/data/2.5/weather?lat=".$lat."&lon=".$long."&appid=".$key."&mode=xml&units=metric");
    curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, TRUE);
    $result = curl_exec($curl_request);

    // send results back
    echo $result;

    // Close cURL connection
    curl_close($curl_request);


?>