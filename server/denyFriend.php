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
$friend = $_GET["friend"];

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
    $jsonResponse = array("status" => false, "response" => "password_error");
    while($row = $result->fetch_assoc()) {
        if($password == $row['password']) {
            $result2 = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $friend . "'");
            
            $cRequests = $row['requests'];
            $cRequestsFR = "";
            $nRequestsFR = "";

            $friends = $row['friends'];

            $nRequests = str_replace("~~" . $friend . "~R", "", $cRequests);
            if(strlen($nRequests) == 2) {
                $nRequests = "";
            }

            $jsonResponse = array("status" => false, "response" => "unknown_error", "requests" => $cRequests, "friends" => $friends);

            while($row2 = $result2->fetch_assoc()) {
                $cRequestsFR = $row2['requests'];
                $nRequestsFR = str_replace("~~" . $username . "~S", "", $cRequestsFR);
                if(strlen($nRequestsFR) == 2) {
                    $nRequestsFR = "";
                }

                $cToN = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "' WHERE username LIKE '" . $username . "'");
                $cToNFR = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "' WHERE username LIKE '" . $friend . "'");

                if($cToN && $cToNFR) {
                    $jsonResponse = array("status" => true, "requests" => $nRequests, "friends" => $friends);
                } else {
                    $t2;
                    if($cToN) {
                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "' WHERE username LIKE '" . $friend . "'");
                    } elseif($cToNFR) {
                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "' WHERE username LIKE '" . $username . "'");
                    }
                    if($t2) {
                        $jsonResponse = array("status" => true, "requests" => $nRequests, "friends" => $friends);
                    } else {
                        $jsonResponse = array("status" => false, "response" => "unknown_error", "requests" => $cRequests, "friends" => $friends);
                    }
                }
            }
            //$people = rtrim($people, "~~");
        }
    }
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();

?>