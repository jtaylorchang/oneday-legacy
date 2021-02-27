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

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//check if user exists and if password matches. If so, return the friends, requests, and compactSchedule

$sql = "SELECT * FROM users";
//echo($sql);
$result = mysqli_query($connect, $sql);

if (mysqli_num_rows($result) > 0) {
    //found
    $jsonResponse = array("status" => false, "response" => "dne_error");
    $people = "~~";
    while ($row = $result->fetch_assoc()) {
        $people = $people . $row['username'] . "~~";
    }
    $name = explode("~~", $people);
    $jsonResponse["status"] = true;
    $jsonResponse["response"] = "success";

    foreach ($name as $value) {
        if (strlen($value) > 0) {
            $result3 = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $value . "'");
            $lastActive = "";
            $suspended = "";
            $uid = "";
            while ($row3 = $result3->fetch_assoc()) {
                $username = $row3['username'];
                $lastActive = $row3['lastActive'];
                $suspended = $row3['suspended'];
                $superUser = $row3['super'];
                $uid = $row3['uid'];
                if (strlen($lastActive) > 0) {
                } else {
                    $lastActive = "0000-00-00";
                }
                if (strlen($suspended) > 0) {
                } else {
                    $suspended = "0";
                }
                if (strlen($uid) > 0) {
                } else {
                    $uid = "###";
                }
            }

            $jsonResponse[$username . "~lastActive"] = $lastActive;
            $jsonResponse[$username . "~suspended"] = $suspended;
            $jsonResponse[$username . "~uid"] = $uid;
            $jsonResponse[$username . "~super"] = $superUser;
        }
    }
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();
