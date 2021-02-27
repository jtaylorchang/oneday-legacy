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

$targetDayDate = $_GET["date"];
$targetDayType = $_GET["type"];
$targetDayLetters = $_GET["letters"];
$targetDayNumber = $_GET["number"];
if ($targetDayNumber == "undefined") {
    $targetDayNumber = "";
}
$targetDayTimeType = $_GET["timeType"];
$targetDayILunch = $_GET["iLunch"];
$targetDayTimeP1 = $_GET["timeP1"];
$targetDayTimeP2 = $_GET["timeP2"];
$targetDayTimeP3 = $_GET["timeP3"];
$targetDayTimeP4 = $_GET["timeP4"];
$targetDayTimeP5 = $_GET["timeP5"];
$targetDayTimeP6 = $_GET["timeP6"];
$targetDayTimeP7 = $_GET["timeP7"];
$targetDayTimeP8 = $_GET["timeP8"];
$targetDayAutoEdit = $_GET["autoEdit"];
$targetDayAnchor = $_GET["anchor"];
$targetDayCountNumber = $_GET["countNumber"];

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

                $result = mysqli_query($connect, "SELECT * FROM schedule WHERE dayDate LIKE '" . $targetDayDate . "'");
                if (mysqli_num_rows($result) > 0) {
                    //UPDATE
                    $result2 = mysqli_query($connect, "UPDATE schedule SET dayType='" . $targetDayType . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result3 = mysqli_query($connect, "UPDATE schedule SET dayLetters='" . $targetDayLetters . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result4 = mysqli_query($connect, "UPDATE schedule SET dayNumber='" . $targetDayNumber . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result5 = mysqli_query($connect, "UPDATE schedule SET dayTimeType='" . $targetDayTimeType . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result6 = mysqli_query($connect, "UPDATE schedule SET dayILunch='" . $targetDayILunch . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result7 = mysqli_query($connect, "UPDATE schedule SET dayTimeP1='" . $targetDayTimeP1 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result8 = mysqli_query($connect, "UPDATE schedule SET dayTimeP2='" . $targetDayTimeP2 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result9 = mysqli_query($connect, "UPDATE schedule SET dayTimeP3='" . $targetDayTimeP3 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result10 = mysqli_query($connect, "UPDATE schedule SET dayTimeP4='" . $targetDayTimeP4 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result11 = mysqli_query($connect, "UPDATE schedule SET dayTimeP5='" . $targetDayTimeP5 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result12 = mysqli_query($connect, "UPDATE schedule SET dayTimeP6='" . $targetDayTimeP6 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result13 = mysqli_query($connect, "UPDATE schedule SET dayTimeP7='" . $targetDayTimeP7 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result14 = mysqli_query($connect, "UPDATE schedule SET dayTimeP8='" . $targetDayTimeP8 . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result15 = mysqli_query($connect, "UPDATE schedule SET autoEdit='" . $targetDayAutoEdit . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result16 = mysqli_query($connect, "UPDATE schedule SET anchor='" . $targetDayAnchor . "' WHERE dayDate LIKE '" . $targetDayDate . "'");
                    $result17 = mysqli_query($connect, "UPDATE schedule SET countNumber='" . $targetDayCountNumber . "' WHERE dayDate LIKE '" . $targetDayDate . "'");

                    $jsonResponse = array("status" => true, "response" => "success");
                } else {
                    //INSERT
                    $q = "INSERT INTO schedule (dayDate, dayType, dayLetters, dayNumber, dayTimeType, dayILunch, dayTimeP1, dayTimeP2, dayTimeP3, dayTimeP4, dayTimeP5, dayTimeP6, dayTimeP7, dayTimeP8, autoEdit, anchor, countNumber) VALUES ('" . $targetDayDate . "', '" . $targetDayType . "', '" . $targetDayLetters . "', '" . $targetDayNumber . "', '" . $targetDayTimeType . "', '" . $targetDayILunch . "', '" . $targetDayTimeP1 . "', '" . $targetDayTimeP2 . "', '" . $targetDayTimeP3 . "', '" . $targetDayTimeP4 . "', '" . $targetDayTimeP5 . "', '" . $targetDayTimeP6 . "', '" . $targetDayTimeP7 . "', '" . $targetDayTimeP8 . "', '" . $targetDayAutoEdit . "', '" . $targetDayAnchor . "', '" . $targetDayCountNumber . "')";
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
