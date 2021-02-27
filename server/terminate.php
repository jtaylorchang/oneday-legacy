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
$target = $_GET["target"];

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
            if($row['super'] == "1" || $row['super'] == 1) {
                //$b = mysqli_query($connect, "DELETE FROM users WHERE username LIKE '" . $target . "'");

                $result2 = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $target . "'");
                $people = "~~";
                $people2 = "~~";
                while($row2 = $result2->fetch_assoc()) {
                    $people = $row2['friends'];
                    $people2 = $row2['requests'];
                }
                $names = explode("~~", $people);
                foreach($names as $value) {
                    if(strlen($value) > 0) {
                        $result3 = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $value . "'");
                        $cFriends;
                        $nFriends;
                        while($row3 = $result3->fetch_assoc()) {
                            $cFriends = $row3['friends'];
                            $nFriends = str_replace("~~" . $target . "~~", "~~", $cFriends);

                            mysqli_query($connect, "UPDATE users SET friends='" . $nFriends . "' WHERE username LIKE '" . $value . "'");
                        }
                    }
                }

                $people2 = str_replace("~R~~", "~~", $people2);
                $people2 = str_replace("~S~~", "~~", $people2);

                $names2 = explode("~~", $people2);
                foreach($names2 as $value2) {
                    if(strlen($value2) > 0) {
                        $result4 = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $value2 . "'");
                        $cRequests;
                        $nRequests;
                        while($row4 = $result4->fetch_assoc()) {
                            $cRequests = $row4['requests'];
                            $nRequests = str_replace("~~" . $target . "~R~~", "~~", $cRequests);
                            $nRequests = str_replace("~~" . $target . "~S~~", "~~", $nRequests);

                            mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "' WHERE username LIKE '" . $value2 . "'");
                        }
                    }
                }

                mysqli_query($connect, "DELETE FROM users WHERE username LIKE '" . $target . "'");

                /*$result2 = mysqli_query($connect, "SELECT * FROM users WHERE friends LIKE '%~~" . $target . "~~%'");
                $people
                if(mysqli_num_rows($result2) > 0) {
                    while($row2 = $result2->fetch_assoc()) {
                        
                    }
                }*/

                /*$result3 = mysqli_query($connect, "SELECT * FROM users WHERE requests LIKE '%~~" . $target . "~S~~%'");

                $result4 = mysqli_query($connect, "SELECT * FROM users WHERE requests LIKE '%~~" . $target . "~R~~%'");*/

                $jsonResponse = array("status" => true, "response" => "success");
            } else {
                $jsonResponse = array("status" => false, "response" => "clearance_error");
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