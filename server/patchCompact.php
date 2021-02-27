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

$patch = "~~1~Tap to change~not chosen~~2~Tap to change~not chosen~~3~Tap to change~not chosen~~4~Tap to change~not chosen~~5~Tap to change~not chosen~~6~Tap to change~not chosen~~7~Tap to change~not chosen~~8~Tap to change~not chosen~~";

$sql = "SELECT * FROM users";
//echo($sql);
$result = mysqli_query($connect, $sql);

$fixes = 0;

if(mysqli_num_rows($result) > 0) {
    while($row = $result->fetch_assoc()) {
        $username = $row['username'];
        $compactA = $row['compactA'];
        $compactB = $row['compactB'];
        $compactC = $row['compactC'];
        $compactD = $row['compactD'];
        $compactE = $row['compactE'];
        $compactF = $row['compactF'];
        $compactG = $row['compactG'];
        if(substr_count($compactA, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactA='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
        if(substr_count($compactB, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactB='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
        if(substr_count($compactC, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactC='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
        if(substr_count($compactD, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactD='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
        if(substr_count($compactE, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactE='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
        if(substr_count($compactF, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactF='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
        if(substr_count($compactG, "~") !== substr_count($patch, "~")) {
            mysqli_query($connect, "UPDATE users SET compactG='" . $patch . "' WHERE username LIKE '" . $username . "'");
            $fixes++;
        }
    }
    $jsonResponse = array("status" => true,
        "response" => "success",
        "fixes" => $fixes);
} else {
    //not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();

?>