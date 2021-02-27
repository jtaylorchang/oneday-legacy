<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: Origin');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}

header('Content-type:application/json;charset=utf-8');

/*
dateStamp
sumDATE
sumIOS
sumANDROID
sumUNIQUE
*/

$os = $_GET["os"];
$unique = $_GET["unique"];
$dt = date("Y") . "-" . date("m") . "-" . date("d");
$tt = date("H"); // + ":" + round(date('i') / 30) * 30;

$host_name  = "CHANGE_ME";
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$password   = "CHANGE_ME";

$connect = mysqli_connect($host_name, $user_name, $password, $database);
$sql = "SELECT * FROM plus WHERE dateStamp LIKE '" . $dt . "'";

$result = mysqli_query($connect, $sql);

$jsonResponse = array("status" => true, "response" => "success");

if (mysqli_num_rows($result) > 0) {
    while ($row = $result->fetch_assoc()) {
        $sumDATE = $row['sumDATE'];
        $sumIOS = $row['sumIOS'];
        $sumANDROID = $row['sumANDROID'];
        $sumUNIQUE = $row['sumUNIQUE'];

        if ($unique === "true" || $unique === true) {
            $sumUNIQUE += 1;
        }
        if ($os == "ios") {
            $sumIOS += 1;
        } elseif ($os == "android") {
            $sumANDROID += 1;
        }

        $sumDATE += 1;

        $track = mysqli_query($connect, "UPDATE plus SET sumDATE='" . $sumDATE . "', sumIOS='" . $sumIOS . "', sumANDROID='" . $sumANDROID . "', sumUNIQUE='" . $sumUNIQUE . "' WHERE dateStamp LIKE '" . $dt . "'");
        if ($track) {
            $jsonResponse = array("status" => true, "response" => "success");
        } else {
            $jsonResponse = array("status" => false, "response" => "failure");
        }
    }
} else {
    $sumDATE = 1;
    $sumIOS = 0;
    $sumANDROID = 0;
    $sumUNIQUE = 0;

    if ($unique === "true" || $unique === true) {
        $sumUNIQUE = 1;
    }
    if ($os == "ios") {
        $sumIOS = 1;
    } elseif ($os == "android") {
        $sumANDROID = 1;
    }

    $track = mysqli_query($connect, "INSERT INTO plus (dateStamp, sumDATE, sumIOS, sumANDROID, sumUNIQUE) VALUES ('" . $dt . "', '" . $sumDATE . "', '" . $sumIOS . "', '" . $sumANDROID . "', '" . $sumUNIQUE . "')");
    if ($track) {
        $jsonResponse = array("status" => true, "response" => "success");
    } else {
        $jsonResponse = array("status" => false, "response" => "failure");
    }
}

echo json_encode($jsonResponse);
