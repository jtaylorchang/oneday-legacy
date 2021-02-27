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

$revenue = $_GET["revenue"];
$dt = date("Y") . "-" . date("m") . "-" . date("d");

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

        $track = mysqli_query($connect, "UPDATE plus SET revenue='" . $revenue . "' WHERE dateStamp LIKE '" . $dt . "'");
        if ($track) {
            $jsonResponse = array("status" => true, "response" => "success");
        } else {
            $jsonResponse = array("status" => false, "response" => "failure");
        }
    }
}

echo json_encode($jsonResponse);
