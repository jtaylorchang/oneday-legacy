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

$friends = $_GET["friends"];

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME"; //is password right?

$jsonResponse =  array("status" => false, "response" => "error");

$friendNames = explode("~~", $friends);
foreach ($friendNames as $value) {
    if (strlen($value) > 0) {

        $result = mysqli_query($connect, "SELECT * FROM social WHERE username LIKE '" . $value . "'");
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = array(
                "dt" => $row['dt'],
                "tt" => $row['tt'],
                "content" => $row['content']
            );
        }
        $jsonResponse[$value] = $posts;
        // possibly provide homework and social in same script
    }
}

echo json_encode($jsonResponse);
