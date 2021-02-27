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

$host_name  = "CHANGE_ME";//change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse;//respond with either success or failure

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//check if user exists and if password matches. If so, return the friends, requests, and compactSchedule

$sql = "SELECT * FROM users WHERE username LIKE '" . $username . "'";
//echo($sql);
$result = mysqli_query($connect, $sql);

if(mysqli_num_rows($result) > 0) {
    //found
    $jsonResponse = array("status" => false, "response" => "success");
    while($row = $result->fetch_assoc()) {
        if($row['verified'] == "1" || $row['verified'] == 1) {
            if($row['super'] == "1" || $row['super'] == 1) {
                $jsonResponse = array("status" => true, "response" => "success");
            }
        }
    }
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();

?>