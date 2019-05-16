<?php
    // Get variables from query string
    $lat =  $_GET["lat"];
    $long = $_GET["long"];

    // Set up and execute cURL request
    $curl_request = curl_init("https://api.sunrise-sunset.org/json?lat=".$lat."&lng=".$long."&formatted=0");
    curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, TRUE);
    $result = curl_exec($curl_request);

    // Send back the results
    echo $result;

    // Close cURL connection
    curl_close($curl_request);


?>