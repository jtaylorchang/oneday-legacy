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

$username = $_GET["username"];
$password = md5($_GET["password"]);

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//check if user exists and if password matches. If so, return the friends, requests, and compactSchedule

$sql = "SELECT * FROM users WHERE username LIKE '" . $username . "'";
//echo($sql);
$result = mysqli_query($connect, $sql);

$lastAdDay = "";
$today = date("Y") . "-" . date("m") . "-" . date("d");
$shouldShow = false;

if (mysqli_num_rows($result) > 0) {
    //found
    $jsonResponse = array("status" => false, "response" => "password_error");
    while ($row = $result->fetch_assoc()) {
        if ($password == $row['password']) {
            $lastAdDay = $row['lastActive'];
            $lastAdTime = $row['adTime'];
            if ($lastAdDay !== $today) {
                $shouldShow = true;
            } else {
                if ((time() - $lastAdTime) >= 3600) {
                    $shouldShow = true;
                }
            }
            $jsonResponse = array(
                "status" => true,
                "response" => "success",
                "lastActive" => $row['lastActive'],
                "adTime" => $row['adTime'],
                "shouldShow" => $shouldShow
            );
        }
    }
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();
