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

$host_name  = "CHANGE_ME";//change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse;//respond with either success or failure
$people = "";
$friends = "";
$requests = "";

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
            $result2 = mysqli_query($connect, "SELECT * FROM users");
            $people = "~~";
            while($row2 = $result2->fetch_assoc()) {
                $people = $people . $row2['username'] . "~" . $row2['firstName'] . "~" . $row2['lastName'] . "~" . $row2['gradYear'] . "~" . $row2['verified'] . "~" . (substr_count($row2['friends'], "~~") - 1) . "~" . $row2['privacy'] . "~~";
            }
            //$people = rtrim($people, "~~");

            $jsonResponse = array("status" => true,
                                "people" => $people,
                                "friends" => $row['friends'],
                                "requests" => $row['requests']);

            $friendNames = explode("~~", $row['friends']);
            foreach($friendNames as $value) {
                if(strlen($value) > 0) {

                    $result3 = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $value . "'");
                    $cA = "";
                    $cB = "";
                    $cC = "";
                    $cD = "";
                    $cE = "";
                    $cF = "";
                    $cG = "";
                    while($row3 = $result3->fetch_assoc()) {
                        $cA = $row3['compactA'];
                        $cB = $row3['compactB'];
                        $cC = $row3['compactC'];
                        $cD = $row3['compactD'];
                        $cE = $row3['compactE'];
                        $cF = $row3['compactF'];
                        $cG = $row3['compactG'];
                    }
                    
                    $jsonResponse[$value . "~A"] = $cA;
                    $jsonResponse[$value . "~B"] = $cB;
                    $jsonResponse[$value . "~C"] = $cC;
                    $jsonResponse[$value . "~D"] = $cD;
                    $jsonResponse[$value . "~E"] = $cE;
                    $jsonResponse[$value . "~F"] = $cF;
                    $jsonResponse[$value . "~G"] = $cG;
                }
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