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

$host_name  = "CHANGE_ME";
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse;//respond with either success or failure

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//check if user exists and if password matches. If so, return the friends, requests, and compactSchedule

$sql = "SELECT * FROM news";
//echo($sql);
$result = mysqli_query($connect, $sql);

$jsonResponse = array("status" => false, "response" => "dnr_error");
if(mysqli_num_rows($result) > 0) {
    //found
    $news;
    $announcements = [];
    $updates = [];

    while($row = $result->fetch_assoc()) {
        if($row['category'] == "announcement") {
            $announcements[] = array(
                "id" => $row['id'],
                "dt" => $row['dt'],
                "title" => $row['title'],
                "content" => $row['content'],
                "category" => $row['category']
            );
        }
        if($row['category'] == "update") {
            $updates[] = array(
                "id" => $row['id'],
                "dt" => $row['dt'],
                "title" => $row['title'],
                "content" => $row['content'],
                "category" => $row['category']
            );
        }
    }
    $news = array(
        "announcements" => $announcements,
        "updates" => $updates
    );
    $jsonResponse = array("status" => true,
        "response" => "success",
        "news" => $news);
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();

?>