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

//get submitted date and details

//check if the desired date already exists
//update the existing if so
//insert new if not

$host_name_auth  = "CHANGE_ME"; //change these to the correct table
$database_auth   = "CHANGE_ME";
$user_name_auth  = "CHANGE_ME";
$pass_word_auth  = "CHANGE_ME";

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure

$connect_auth = mysqli_connect($host_name_auth, $user_name_auth, $pass_word_auth, $database_auth);
$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

$username = $_GET["username"];
$password = md5($_GET["password"]);

$targetHook = "SETTINGS";
$targetVersion = $_GET["version"];
$targetReq = $_GET["req"];
$targetMandatory = $_GET["mandatory"];
$targetLunch1 = $_GET["lunch1"];
$targetLunch2 = $_GET["lunch2"];
$targetLunch3 = $_GET["lunch3"];
$targetLunch4 = $_GET["lunch4"];
$targetTimeRegularR = $_GET["timeRegularR"];
$targetTimeRegularWithAPR = $_GET["timeRegularWithAPR"];
$targetTimeLateStartR = $_GET["timeLateStartR"];
$targetTimeEarlyReleaseWithAPR = $_GET["timeEarlyReleaseWithAPR"];
$targetTimeEarlyReleaseWithoutAPR = $_GET["timeEarlyReleaseWithoutAPR"];
$targetTimeEarlyReleaseAllWithoutAPR = $_GET["timeEarlyReleaseAllWithoutAPR"];

$sql = "SELECT * FROM users WHERE username LIKE '" . $username . "'";

//$sql = "SELECT * FROM schedule";
//echo($sql);
$result_auth = mysqli_query($connect_auth, $sql);

if (mysqli_num_rows($result_auth) > 0) {
    $jsonResponse = array("status" => false, "response" => "password_error");
    while ($row_auth = $result_auth->fetch_assoc()) {
        if ($password == $row_auth['password']) {
            if ($row_auth['verified'] == "1" || $row_auth['verified'] == 1) {
                //SUCCESS
                $jsonResponse = array("status" => false, "response" => "fetch_error");

                $result = mysqli_query($connect, "SELECT * FROM settings WHERE hook LIKE 'SETTINGS'");
                if (mysqli_num_rows($result) > 0) {
                    //UPDATE
                    $result2 = mysqli_query($connect, "UPDATE settings SET version='" . $targetVersion . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result3 = mysqli_query($connect, "UPDATE settings SET req='" . $targetReq . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result4 = mysqli_query($connect, "UPDATE settings SET mandatory='" . $targetMandatory . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result5 = mysqli_query($connect, "UPDATE settings SET lunch1='" . $targetLunch1 . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result6 = mysqli_query($connect, "UPDATE settings SET lunch2='" . $targetLunch2 . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result7 = mysqli_query($connect, "UPDATE settings SET lunch3='" . $targetLunch3 . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result8 = mysqli_query($connect, "UPDATE settings SET lunch4='" . $targetLunch4 . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result9 = mysqli_query($connect, "UPDATE settings SET timeRegularR='" . $targetTimeRegularR . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result10 = mysqli_query($connect, "UPDATE settings SET timeRegularWithAPR='" . $targetTimeRegularWithAPR . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result11 = mysqli_query($connect, "UPDATE settings SET timeLateStartR='" . $targetTimeLateStartR . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result12 = mysqli_query($connect, "UPDATE settings SET timeEarlyReleaseWithAPR='" . $targetTimeEarlyReleaseWithAPR . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result13 = mysqli_query($connect, "UPDATE settings SET timeEarlyReleaseWithoutAPR='" . $targetTimeEarlyReleaseWithoutAPR . "' WHERE hook LIKE '" . $targetHook . "'");
                    $result14 = mysqli_query($connect, "UPDATE settings SET timeEarlyReleaseAllWithoutAPR='" . $targetTimeEarlyReleaseAllWithoutAPR . "' WHERE hook LIKE '" . $targetHook . "'");

                    $jsonResponse = array("status" => true, "response" => "success");
                } else {
                    //INSERT
                    $q = "INSERT INTO settings (hook, version, req, mandatory, lunch1, lunch2, lunch3, lunch4, timeRegularR, timeRegularWithAPR, timeLateStartR, timeEarlyReleaseWithAPR, timeEarlyReleaseWithoutAPR, timeEarlyReleaseAllWithoutAPR) VALUES ('" . $targetHook . "', '" . $targetVersion . "', '" . $targetReq . "', '" . $targetMandatory . "', '" . $targetLunch1 . "', '" . $targetLunch2 . "', '" . $targetLunch3 . "', '" . $targetLunch4 . "', '" . $targetTimeRegularR . "', '" . $targetTimeRegularWithAPR . "', '" . $targetTimeLateStartR . "', '" . $targetTimeEarlyReleaseWithAPR . "', '" . $targetTimeEarlyReleaseWithoutAPR . "', '" . $targetTimeEarlyReleaseAllWithoutAPR . "')";
                    if (mysqli_query($connect, $q)) {
                        $jsonResponse = array("status" => true, "response" => "success");
                    } else {
                        $jsonResponse = array("status" => false, "response" => "insert_error");
                    }
                }
            } else {
                //FAILURE
                $jsonResponse = array("status" => false, "response" => "clearance_error");
            }
        }
    }
} else {
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();
