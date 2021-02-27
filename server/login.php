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
$uid = $_GET["uid"];

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


$os = "android";
$lastAccess = "YYYY-MM-DD";
$today = "YYYY-MM-DD";

if (strpos($uid, '-') !== false) {
    $os = "ios";
}

if (mysqli_num_rows($result) > 0) {
    //found
    $jsonResponse = array("status" => false, "response" => "password_error");
    while ($row = $result->fetch_assoc()) {
        if ($password == $row['password']) {
            if (strlen($row['uid']) > 0) {
            } else {
                if (strlen($uid) > 0) {
                    if (strtolower($uid) === strtolower("[object Object]")) {
                    } else {
                        $updateUID = mysqli_query($connect, "UPDATE users SET uid='" . $uid . "' WHERE username LIKE '" . $username . "'");
                    }
                }
            }

            /*
                update lastActive
            */
            $lastAccess = $row['lastActive'];
            $today = date("Y") . "-" . date("m") . "-" . date("d");
            $updateLA = mysqli_query($connect, "UPDATE users SET lastActive='" . $today . "' WHERE username LIKE '" . $username . "'");

            $jsonResponse = array(
                "status" => true,
                "response" => "success",
                "firstName" => $row['firstName'],
                "lastName" => $row['lastName'],
                "gradYear" => $row['gradYear'],
                "friends" => $row['friends'],
                "requests" => $row['requests'],
                "compactA" => $row['compactA'],
                "compactB" => $row['compactB'],
                "compactC" => $row['compactC'],
                "compactD" => $row['compactD'],
                "compactE" => $row['compactE'],
                "compactF" => $row['compactF'],
                "compactG" => $row['compactG'],
                "verified" => $row['verified'],
                "privacy" => $row['privacy'],
                "suspended" => $row['suspended'],
                "adTime" => $row['adTime'],
                "lastAccess" => $lastAccess
            );
        }
    }
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);

$unique = "false";
if ($lastAccess !== $today) {
    $unique = "true";
}
//$connect->close();
file_get_contents("https://jefftc.com/oneday/us/track.php?os=" . $os . "&unique=" . $unique);
