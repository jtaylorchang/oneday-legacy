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

$username = strtolower($_GET["username"]);
$password = md5($_GET["password"]);
$friend = strtolower($_GET["friend"]);

$host_name  = "CHANGE_ME"; //change these to the correct table
$database   = "CHANGE_ME";
$user_name  = "CHANGE_ME";
$pass_word  = "CHANGE_ME";

$jsonResponse; //respond with either success or failure

$connect = mysqli_connect($host_name, $user_name, $pass_word, $database);

//check if user exists and if password matches. If so, return the friends, requests, and compactSchedule

$sql = "SELECT * FROM users WHERE username LIKE '" . $username . "'";
//echo($sql);
$result = mysqli_query($connect, $sql);

if (mysqli_num_rows($result) > 0) {
    //found
    $jsonResponse = array("status" => false, "response" => "password_error");
    while ($row = $result->fetch_assoc()) {
        if ($password == $row['password']) {
            $getFriendsRequests = mysqli_query($connect, "SELECT * FROM users WHERE username LIKE '" . $friend . "'");
            if (mysqli_num_rows($getFriendsRequests) > 0) {
                while ($rowFR = $getFriendsRequests->fetch_assoc()) {
                    if (strpos(($row['friends']), ("~~" . $friend . "~~")) != false) {
                        $jsonResponse = array("status" => true, "response" => "success", "requests" => $row['requests'], "friends" => $row['friends']);
                    } else if (strpos(($rowFR['friends']), ("~~" . $username . "~~")) != false) {
                        $jsonResponse = array("status" => true, "response" => "success", "requests" => $row['requests'], "friends" => $row['friends']);
                    } else {
                        if (strpos(($row['requests']), ("~~" . $friend . "~")) !== false) { //friend request pending

                            if (strpos(($row['requests']), ("~~" . $friend . "~S")) !== false) { //already sent one. Check friend feed for received
                                //TODO
                                //1 - CHECK FRIEND FOR REQUEST
                                if (strpos(($rowFR['requests']), ("~~" . $username . "~S")) !== false) {
                                    //TODO
                                    //2b- IF FRIEND HAS "S" THEN CONFIRM FOR BOTH AND REMOVE FROM BOTH
                                    $cRequests = $row['requests'];
                                    $cFriends = $row['friends'];
                                    $cRequestsFR = $rowFR['requests'];
                                    $cFriendsFR = $rowFR['friends'];

                                    if (strlen($cRequests) == 0) {
                                        $cRequests = "~~";
                                    }
                                    if (strlen($cRequestsFR) == 0) {
                                        $cRequestsFR = "~~";
                                    }
                                    if (strlen($cFriends) == 0) {
                                        $cFriends = "~~";
                                    }
                                    if (strlen($cFriendsFR) == 0) {
                                        $cFriendsFR = "~~";
                                    }

                                    //sample
                                    //~~jdoe~S~~bob~S~~                 --> ~~bob~S~~
                                    //~~bob~S~~jdoe~S~~tom~S~~          --> ~~bob~S~~tom~S~~
                                    //~~bob~S~~jdoe~S~~                 --> ~~bob~S~~
                                    $nRequests = str_replace("~~" . $friend . "~S", "", $cRequests); //trim the ~~friend~S then replace any ~~~~ with ~~ or add the before and after segments
                                    $nFriends = $cFriends . $friend . "~~";
                                    $nRequestsFR = str_replace("~~" . $username . "~S", "", $cRequestsFR); //trim the ~~username~S then replace any ~~~~ with ~~ or add the before and after segments
                                    $nFriendsFR = $cFriendsFR . $username . "~~";

                                    $cToN = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "', friends='" . $nFriends . "' WHERE username LIKE '" . $username . "'");
                                    $cToNFR = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "', friends='" . $nFriendsFR . "' WHERE username LIKE '" . $friend . "'");

                                    if ($cToN && $cToNFR) {
                                        $jsonResponse = array("status" => true, "response" => "success", "requests" => $nRequests, "friends" => $nFriends);
                                    } else {
                                        $t2;
                                        if ($cToN) {
                                            $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "', friends='" . $nFriendsFR . "' WHERE username LIKE '" . $friend . "'");
                                        } elseif ($cToNFR) {
                                            $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "', friends='" . $nFriends . "' WHERE username LIKE '" . $username . "'");
                                        }
                                        if ($t2) {
                                            $jsonResponse = array("status" => true, "response" => "success", "requests" => $nRequests, "friends" => $nFriends);
                                        } else {
                                            $jsonResponse = array("status" => false, "response" => "unknown_error");
                                        }
                                    }
                                } else if (strpos(($rowFR['requests']), ("~~" . $username . "~R")) !== false) {
                                    //2c- IF FRIEND HAS "R" THEN SEND "sent_error"
                                    $jsonResponse = array("status" => false, "response" => "sent_error", "requests" => $row['requests'], "friends" => $row['friends']);
                                } else {
                                    //2a- IF FRIEND DOES NOT HAVE "R" THEN ADD IT and return sent_error
                                    $cRequestsFR = $rowFR['requests'];

                                    if (strlen($cRequestsFR) == 0) {
                                        $cRequestsFR = "~~";
                                    }

                                    $nRequestsFR = $cRequestsFR . $username . "~R~~";

                                    $cToNFR = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "' WHERE username LIKE '" . $friend . "'");
                                    $jsonResponse = array("status" => false, "response" => "sent_error", "requests" => $row['requests'], "friends" => $row['friends']);
                                }
                            } elseif (strpos(($row['requests']), ("~~" . $friend . "~R")) !== false) { //received one therefore confirm it and remove from both people request feeds (possibly trim the ~~username~R~~ or S)
                                //ADD FRIEND TO BOTH
                                //REMOVE R FROM USER AND S FROM FRIEND
                                $cRequests = $row['requests'];
                                $cFriends = $row['friends'];
                                $cRequestsFR = $rowFR['requests'];
                                $cFriendsFR = $rowFR['friends'];

                                if (strlen($cRequests) == 0) {
                                    $cRequests = "~~";
                                }
                                if (strlen($cRequestsFR) == 0) {
                                    $cRequestsFR = "~~";
                                }
                                if (strlen($cFriends) == 0) {
                                    $cFriends = "~~";
                                }
                                if (strlen($cFriendsFR) == 0) {
                                    $cFriendsFR = "~~";
                                }

                                //sample
                                //~~jdoe~S~~bob~S~~                 --> ~~bob~S~~
                                //~~bob~S~~jdoe~S~~tom~S~~          --> ~~bob~S~~tom~S~~
                                //~~bob~S~~jdoe~S~~                 --> ~~bob~S~~
                                $nRequests = str_replace("~~" . $friend . "~R", "", $cRequests); //trim the ~~friend~S then replace any ~~~~ with ~~ or add the before and after segments
                                $nFriends = $cFriends . $friend . "~~";
                                $nRequestsFR = str_replace("~~" . $username . "~S", "", $cRequestsFR); //trim the ~~username~S then replace any ~~~~ with ~~ or add the before and after segments
                                $nRequestsFR = str_replace("~~" . $username . "~R", "", $nRequestsFR);
                                $nFriendsFR = $cFriendsFR . $username . "~~";

                                $cToN = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "', friends='" . $nFriends . "' WHERE username LIKE '" . $username . "'");
                                $cToNFR = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "', friends='" . $nFriendsFR . "' WHERE username LIKE '" . $friend . "'");

                                if ($cToN && $cToNFR) {
                                    $jsonResponse = array("status" => true, "response" => "success", "requests" => $nRequests, "friends" => $nFriends);
                                } else {
                                    $t2;
                                    if ($cToN) {
                                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "', friends='" . $nFriendsFR . "' WHERE username LIKE '" . $friend . "'");
                                    } elseif ($cToNFR) {
                                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "', friends='" . $nFriends . "' WHERE username LIKE '" . $username . "'");
                                    }
                                    if ($t2) {
                                        $jsonResponse = array("status" => true, "response" => "success", "requests" => $nRequests, "friends" => $nFriends);
                                    } else {
                                        $jsonResponse = array("status" => false, "response" => "unknown_error", "requests" => $row['requests'], "friends" => $row['friends']);
                                    }
                                }
                            }
                        } else { //make a new friend request

                            if (strpos(($rowFR['requests']), ("~~" . $username . "~S")) !== false) { //friend already sent one therefore confirm it and remove from friend feed
                                $cFriends = $row['friends'];
                                $cFriendsFR = $rowFR['friends'];
                                $cRequestsFR = $rowFR['requests'];

                                if (strlen($cRequestsFR) == 0) {
                                    $cRequestsFR = "~~";
                                }
                                if (strlen($cFriends) == 0) {
                                    $cFriends = "~~";
                                }
                                if (strlen($cFriendsFR) == 0) {
                                    $cFriendsFR = "~~";
                                }

                                $nFriends = $cFriends . $friend . "~~";
                                $nFriendsFR = $cFriendsFR . $username . "~~";
                                $nRequestsFR = str_replace("~~" . $username . "~S", "", $cRequestsFR);

                                $cToN = mysqli_query($connect, "UPDATE users SET friends='" . $nFriends . "' WHERE username LIKE '" . $username . "'");
                                $cToNFR = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "', friends='" . $nFriendsFR . "' WHERE username LIKE '" . $friend . "'");

                                if ($cToN && $cToNFR) {
                                    $jsonResponse = array("status" => true, "response" => "success", "requests" => $row['requests'], "friends" => $nFriends);
                                } else {
                                    $t2;
                                    if ($cToN) {
                                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "', friends='" . $nFriendsFR . "' WHERE username LIKE '" . $friend . "'");
                                    } elseif ($cToNFR) {
                                        $t2 = mysqli_query($connect, "UPDATE users SET friends='" . $nFriends . "' WHERE username LIKE '" . $username . "'");
                                    }
                                    if ($t2) {
                                        $jsonResponse = array("status" => true, "response" => "success", "requests" => $row['requests'], "friends" => $nFriends);
                                    } else {
                                        $jsonResponse = array("status" => false, "response" => "unknown_error", "requests" => $row['requests'], "friends" => $row['friends']);
                                    }
                                }
                            } else if (strpos(($rowFR['requests']), ("~~" . $username . "~R")) !== false) { //friend already received one. Add "S" to user's requests
                                $cRequests = $row['requests'];

                                if (strlen($cRequests) == 0) {
                                    $cRequests = "~~";
                                }

                                $nRequests = $cRequests . $friend . "~S~~";

                                $cToN = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "' WHERE username LIKE '" . $username . "'");
                                $jsonResponse = array("status" => false, "response" => "sent_error", "requests" => $nRequests, "friends" => $row['friends']);
                            } else { //friend has not received one. Add "R" to friend and add "S" to user
                                //TODO
                                $cRequests = $row['requests'];
                                $cRequestsFR = $rowFR['requests'];

                                if (strlen($cRequests) == 0) {
                                    $cRequests = "~~";
                                }
                                if (strlen($cRequestsFR) == 0) {
                                    $cRequestsFR = "~~";
                                }

                                $nRequests = $cRequests . $friend . "~S~~";
                                $nRequestsFR = $cRequestsFR . $username . "~R~~";

                                $cToN = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "' WHERE username LIKE '" . $username . "'");
                                $cToNFR = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "' WHERE username LIKE '" . $friend . "'");

                                if ($cToN && $cToNFR) {
                                    $jsonResponse = array("status" => true, "response" => "success", "requests" => $nRequests, "friends" => $row['friends']);
                                } else {
                                    $t2;
                                    if ($cToN) {
                                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequestsFR . "' WHERE username LIKE '" . $friend . "'");
                                    } elseif ($cToNFR) {
                                        $t2 = mysqli_query($connect, "UPDATE users SET requests='" . $nRequests . "' WHERE username LIKE '" . $username . "'");
                                    }
                                    if ($t2) {
                                        $jsonResponse = array("status" => true, "response" => "success", "requests" => $nRequests, "friends" => $row['friends']);
                                    } else {
                                        $jsonResponse = array("status" => false, "response" => "unknown_error", "requests" => $row['requests'], "friends" => $row['friends']);
                                    }
                                }
                            }
                        }
                    }
                }
            } else { //person does not exist
                $jsonResponse = array("status" => false, "response" => "friend_dne_error", "requests" => $row['requests'], "friends" => $row['friends']);
            }
        }
    }
} else {
    //user not found
    $jsonResponse = array("status" => false, "response" => "dne_error");
}

echo json_encode($jsonResponse);
//$connect->close();
