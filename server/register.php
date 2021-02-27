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

function clean($s)
{
    return preg_replace('/[^\p{L}\p{N}\s]/u', '', $s);
}

$username = clean(trim(strtolower(str_replace('"', "", str_replace("'", "", $_GET["username"])))));
$password = md5($_GET["password"]);
$gradYear = $_GET["gradYear"];
$firstName = clean(str_replace('"', "", str_replace("'", "", $_GET["firstName"])));
$lastName = clean(str_replace('"', "", str_replace("'", "", $_GET["lastName"])));
$uid = $_GET["uid"];
$friends = "";
$requests = "";
$compactA = str_replace('"', "", str_replace("'", "", $_GET["compactA"]));
$compactB = str_replace('"', "", str_replace("'", "", $_GET["compactB"]));
$compactC = str_replace('"', "", str_replace("'", "", $_GET["compactC"]));
$compactD = str_replace('"', "", str_replace("'", "", $_GET["compactD"]));
$compactE = str_replace('"', "", str_replace("'", "", $_GET["compactE"]));
$compactF = str_replace('"', "", str_replace("'", "", $_GET["compactF"]));
$compactG = str_replace('"', "", str_replace("'", "", $_GET["compactG"]));
$verified = 0;
$privacy = 2;

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure after checking if the user already exists

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//check if the table already contains the desired username

$sql = "SELECT * FROM users WHERE username LIKE '" . $username . "'";
//echo($sql);
$result = mysqli_query($connect, $sql);

if (strlen($uid) > 0) {
    if ($uid == "[object Object]") {
        $uid = "";
    }
} else {
    $uid = "";
}


if (mysqli_num_rows($result) > 0) {
    //echo("Failure: user already exists");
    $jsonResponse = array("status" => false, "response" => "exists_error");
} else {
    if (strlen($username) >= 3) {
        if (strlen($_GET["password"]) >= 4) {
            if (strlen($gradYear >= 2)) {
                $q = "INSERT INTO users (username, password, firstName, lastName, gradYear, friends, requests, compactA, compactB, compactC, compactD, compactE, compactF, compactG, verified, privacy, uid) VALUES ('" . $username . "', '" . $password . "', '" . $firstName . "', '" . $lastName . "', '" . $gradYear . "', '" . $friends . "', '" . $requests . "', '" . $compactA . "', '" . $compactB . "', '" . $compactC . "', '" . $compactD . "', '" . $compactE . "', '" . $compactF . "', '" . $compactG . "', " . $verified . ", " . $privacy . ", '" . $uid . "')";
                //echo($q);
                if (mysqli_query($connect, $q)) {
                    //echo("Success");
                    $jsonResponse = array("status" => true, "response" => "success");
                } else {
                    //echo("Failure");
                    //echo("Failure: insert error");
                    $jsonResponse = array("status" => false, "response" => "insert_error");
                }
            } else {
                //echo("Failure: gradYear too short");
                $jsonResponse = array("status" => false, "response" => "gradYear_error");
            }
        } else {
            //echo("Failure: password too short");
            $jsonResponse = array("status" => false, "response" => "password_error");
        }
    } else {
        //echo("Failure: username too short");
        $jsonResponse = array("status" => false, "response" => "username_error");
    }
}

echo json_encode($jsonResponse);
//$connect->close();
