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

$password = $_GET["password"];
$dt = $_GET["dt"];
$title = str_replace('"', "", str_replace("'", "", $_GET["title"]));
$content = str_replace('"', "", str_replace("'", "", $_GET["content"]));
$category = $_GET["category"];

$host_name  = "CHANGE_ME";
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure after checking if the user already exists

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

if ($password == "CHANGE_ME") {
    $q = "INSERT INTO news (dt, title, content, category) VALUES ('" . $dt . "', '" . $title . "', '" . $content . "', '" . $category . "')";
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
    //echo("Failure: password too short");
    $jsonResponse = array("status" => false, "response" => "password_error");
}

echo json_encode($jsonResponse);
//$connect->close();
