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
$cA = str_replace('"', "", str_replace("'", "", $_GET["compactA"]));
$cB = str_replace('"', "", str_replace("'", "", $_GET["compactB"]));
$cC = str_replace('"', "", str_replace("'", "", $_GET["compactC"]));
$cD = str_replace('"', "", str_replace("'", "", $_GET["compactD"]));
$cE = str_replace('"', "", str_replace("'", "", $_GET["compactE"]));
$cF = str_replace('"', "", str_replace("'", "", $_GET["compactF"]));
$cG = str_replace('"', "", str_replace("'", "", $_GET["compactG"]));

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

            if(strpos($cA, "undefined") !== false || strpos($cB, "undefined") !== false || strpos($cC, "undefined") !== false || strpos($cD, "undefined") !== false || strpos($cE, "undefined") !== false || strpos($cF, "undefined") !== false || strpos($cG, "undefined") !== false) {
                $jsonResponse = array("status" => false, "response" => "undefined_error");
            } else {
                $result2 = mysqli_query($connect, "UPDATE users SET compactA='" . $cA . "', compactB='" . $cB . "', compactC='" . $cC . "', compactD='" . $cD . "', compactE='" . $cE . "', compactF='" . $cF . "', compactG='" . $cG . "' WHERE username LIKE '" . $username . "'");

                $jsonResponse = array("status" => true,
                                    "compactA" => $cA,
                                    "compactB" => $cB,
                                    "compactC" => $cC,
                                    "compactD" => $cD,
                                    "compactE" => $cE,
                                    "compactF" => $cF,
                                    "compactG" => $cG);
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